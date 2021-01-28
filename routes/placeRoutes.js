const router = require('express').Router();
const place_controllers = require('../controllers/place_controllers')

router.get('/',place_controllers.place_get)

router.post('/details',place_controllers.place_details_post)

module.exports = router