const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const Business = require('../models/Business');

const auth = require('../middleware/auth.js');

// @route POST api/businesses
// @desc Resgister a business
// @access Public
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please enter a email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('phone', 'Please add phone').not().isEmpty(),
    check('location', 'Please add location').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, location } = req.body;

    try {
      let business = await Business.findOne({ email });

      if (business) {
        return res.status(400).json({ msg: 'Business already exists' });
      }

      business = new Business({ name, email, password, phone, location });

      const salt = await bcrypt.genSalt(10);

      business.password = await bcrypt.hash(password, salt);

      await business.save();

      const payload = {
        business: {
          id: business.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send('Server error');
    }
  }
);

// @route GET api/businesses?email
// @desc get the appointments business
// @access Private
router.get('/:email', auth, async (req, res) => {
  const { email } = req.params;

  try {
    let business = await Business.findOne({ email });

    if (!business) {
      return res.status(400).json({ msg: 'Business do not exists' });
    }

    res.json(business.appointments);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
