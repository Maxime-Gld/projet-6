const Sauce = require('../models/Sauce');
const fs = require('fs');
const { userInfo } = require('os');

// the CRUD


// POST /sauce permet d'ajouter une sauce sur le site
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
    .then(() => { 
        res.status(201).json({
            message: 'Post saved successfully!'
        })
    })
    .catch(error => {
        res.status(400).json({ error })
    })
};


// GET /sauce permet de voir les details d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
};


// PUT /sauce permet de modifier une sauce si on en est le créateur
exports.modifySauce = (req, res, next) => {

    // on recupere l'image si il y en a une

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : {...req.body };

    // on supprime userId de l'objet pour le remplacer avec celui qu'on recupère du token

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message:" Unauthorized request" })
            } else {

                // si il y a changement de fichier on supprime l'ancien fichier avant de telecharger le nouveau puis on effectue les modifications
                if (sauceObject.imageUrl != undefined) {

                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => 
                    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => {
                        res.status(201).json({
                            message: 'Sauce update successfully!'
                        })
                    })
                    .catch(error => { 
                        res.status(400).json({ error })
                    }));

                // sinon on effectue simplement les modifications
                } else {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => {
                    res.status(201).json({
                        message: 'Sauce update successfully!'
                    })
                })
                .catch(error => { 
                    res.status(400).json({ error })
                })}
            }
        })
};


// Delete /sauce permet de supprimer une sauce si on en est le créateur
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({ message: 'Unauthorized request'})
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => {
                    res.status(200).json({
                        message: 'sauce Deleted'
                    })
                })
                .catch(error => { 
                    res.status(400).json({ error })
                })
            });
        }
    })
    .catch(error => res.status(500).json({ error }));
};


// GET /all sauces permet de récuperer et d'afficher toutes les sauces sur le sites
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then((sauces) => {
        res.status(200).json(sauces)
    })
    .catch(error => {
        res.status(400).json({ error })
    })
};

// Get /like or dislike

exports.likeSauce = (req, res, next) => {

    // User like a sauce for the first time
    // pushing the userId to usersLiked array and incrementing the key likes

    if (req.body.like === 1) {
        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: req.body.like++}, $push: {usersLiked: req.body.userId}})
            .then(() => res.status(200).json({message: 'Like ajouté !'}))
            .catch(error => res.status(400).json({error}))

    // User dislike a sauce for the first time
    // pushing the userId to users$Disliked array and incrementing the key dislikes

    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json({message: 'Dislike ajouté !'}))
            .catch(error => res.status(400).json({error}))
    }

    // User is taking back his like

    else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => { res.status(200).json({message: 'Like deleted !'}) })
                        .catch(error => res.status(400).json({error}))

    // User is talking back his dislike
    
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => { res.status(200).json({message: 'Dislike deleted !'}) })
                        .catch(error => res.status(400).json({error}))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }

}