const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_CONNECT)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// body-parser
app.use(express.json());
// CORS 
app.use(cors());

// routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;