const router = require('express').Router();
const {requireAuth} = require('../middleware/authMiddleware');
const messageControllers = require('../controllers/message_controllers');

// Messages Routes
router.post('/create',messageControllers.createMessage);

//admin edit 
router.get('/list',requireAuth,messageControllers.getMessages);
router.delete('/delete/:id',requireAuth,messageControllers.deleteMessage);


module.exports = router