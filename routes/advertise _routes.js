const router = require('express').Router();
const {requireAuth, grantAccess} = require('../middleware/authMiddleware');
const advertiseControllers = require('../controllers/advertise_controllers');

// Advertise Routes
router.get("/list", advertiseControllers.getAllPlacesAds);

//admin edit 
router.post('/create',requireAuth,grantAccess('readAny','advertise'),advertiseControllers.createPlaceAds);
router.put('/update/:id',requireAuth,grantAccess('updateAny','advertise'),advertiseControllers.updatePlaceAds);
router.delete('/delete/:id',requireAuth,grantAccess('deleteAny','advertise'),advertiseControllers.deletePlaceAds);

module.exports = router