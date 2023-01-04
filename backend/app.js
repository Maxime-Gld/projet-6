const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://Maxime:0HbZa16hfOklBe7a@clusterp6.zmbbgqt.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use((req, res, next) => {
    console.log('Requête reçue')
    next();
});

app.use(cors({
  origin: true
}));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// test pour app
/*
app.use((req, res, next) => {
    res.status(201);
    next();
})

app.use((req, res, next) => {
    res.json({ message: 'Votre requête à bien été reçue'})
    next();
});

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !')
});
*/


app.use('/api/auth', userRoutes);

module.exports = app;