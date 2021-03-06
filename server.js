const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect DB
connectDB();

// Init Middleware

// const corsOptions = {
//   origin: 'https://the-shine-experts.netlify.app/',
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/users'));
app.use('/api/authUser', require('./routes/authUser'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/authBusiness', require('./routes/authBusiness'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at ${PORT}`));
