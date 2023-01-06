const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://Maxime:0HbZa16hfOklBe7a@clusterp6.zmbbgqt.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());
app.use(cors());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;