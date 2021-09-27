const mongoose = require('mongoose');
const urlConnection = process.env.MONGODB_URL;

mongoose.connect(urlConnection);