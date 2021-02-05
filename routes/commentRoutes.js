const router = require('express').Router();
const {requireAuth,grantAccess} = require('../middleware/authMiddleware');
const commentControllers = require('../controllers/commentControllers');

// Comments Routes

router.post('/create',requireAuth,commentControllers.createComment);
router.get('/list',requireAuth,commentControllers.getUserComments);
router.put('/update/:id',requireAuth,commentControllers.updateComment);
router.delete('/delete/:id',requireAuth,commentControllers.deleteComment);



module.exports = router