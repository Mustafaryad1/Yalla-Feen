const router = require('express').Router();
const {requireAuth,grantAccess} = require('../middleware/authMiddleware');
const favoriteControllers = require('../controllers/favorite_controller');

// favorites Routes

router.post('/add/:place_id',requireAuth,favoriteControllers.addFavorite);
router.get('/list',requireAuth,favoriteControllers.getUserFavorites);
router.delete('/remove/:place_id',requireAuth,favoriteControllers.removeFavorite);



module.exports = router