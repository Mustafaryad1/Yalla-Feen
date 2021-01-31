const router = require("express").Router();
const placeControllers = require("../controllers/place_controllers");


router.get("/", placeControllers.getAllPlaces);
router.post("/create", placeControllers.addPlace);
router.put("/:id", placeControllers.updatePlace);
router.delete("/place/:id", (req, res, next) => {
  Place.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;
