const router = require('express').Router();
const {requireAuth} = require('../middleware/authMiddleware');
const advertiseControllers = require('../controllers/advertise_controllers');

// Advertise Routes
router.get("/list", advertiseControllers.getAllPlacesAds);

//admin edit 
router.post('/create',requireAuth,advertiseControllers.createPlaceAds);
router.put('/update/:id',requireAuth,advertiseControllers.updatePlaceAds);
router.delete('/delete/:id',requireAuth,advertiseControllers.deletePlaceAds);

module.exports = router