const Sauce = require('../models/Sauce');

// the CRUD


// method POST (Create)
exports.createSauce = (req, res, next) => {
    const Sauce = new Sauce({
        name: req.body.name,
        manufacterer: req.body.manufacturer,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        ingredient: req.body.ingredient,
        heat: req.body.heat,
        userId: req.body.userId
    });
    Sauce.save()
    .then(() => { 
        res.status(201).json({
            message: 'Post saved successfully!'
        });
    })
    .catch(error => res.status(400).json({ error }));
};


// method GET only one (Read)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
    .then((sauce) => {
        res.status(200).json(sauce);
    })
    .catch(error => res.status(404).json({ error }));
};


// method PUT (Update)
exports.modifySauce = (req, res, next) => {
    const Sauce = new Sauce({
        name: req.body.name,
        manufacterer: req.body.manufacturer,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        ingredient: req.body.ingredient,
        heat: req.body.heat,
        userId: req.body.userId
    });
    Sauce.updateOne({_id: req.params.id}, sauce)
    .then(() => {
        res.status(201).json({
            message: 'Sauce update successfully!'
        });
    })
    .catch(error => res.status(400).json({ error }));
};


// method Delete (Delete)
exports.deleteSauce = (res, req, next) => {
    Sauce.deleteOne({_id: req.params.id})
    .then(() => {
        res.status(200).json({
            message: 'Deleted'
        });
    })
    .catch(error => res.status(400).json({ error }));
};


// affichage de toute les sauces
exports.getAllSauce = (res, req, next) => {
    Sauce.find()
    .then(sauces => {
        res.status(200).json(sauces);
    })
    .catch(error => res.status(400).json({ error }));
};