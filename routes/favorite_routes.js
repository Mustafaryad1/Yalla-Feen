const router = require('express').Router();
const {requireAuth,grantAccess} = require('../middleware/authMiddleware');
const favoriteControllers = require('../controllers/favorite_controller');

// favorites Routes

router.post('/create',requireAuth,favoriteControllers.createFavorite);
router.get('/list',requireAuth,favoriteControllers.getUserFavorites);
router.get('/delete/:id',requireAuth,favoriteControllers.deleteFavorite);



module.exports = router