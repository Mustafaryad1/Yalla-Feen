const router = require('express').Router();
const {requireAuth,grantAccess} = require('../middleware/authMiddleware');
const commentControllers = require('../controllers/commentControllers');

// Comments Routes

router.post('/create',requireAuth,commentControllers.createComment);
router.get('/list',requireAuth,commentControllers.getUserComments);
router.get('/update/:id',requireAuth,commentControllers.updateComment);
router.get('/delete/:id',requireAuth,commentControllers.updateComment);



module.exports = router