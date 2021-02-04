const router = require("express").Router();
const ratingControllers = require("../controllers/rating_controllers");
const {requireAuth} = require('../middleware/authMiddleware')
router.get("/", ratingControllers.getRating);
router.post("/create",requireAuth ,ratingControllers.addRating);
router.post("/update", ratingControllers.updateRating);
router.delete("/rating/:id", (req, res, next) => {
  Place.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;
