const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');
const validate = require("../middleware/validate-input")

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, validate.sauce, sauceCtrl.createSauce);
router.get('/:id', auth, validate.id, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, multer, validate.id, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, validate.id, sauceCtrl.likeSauce)

module.exports = router;