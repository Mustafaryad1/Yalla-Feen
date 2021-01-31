const router = require("express").Router();
const placeControllers = require("../controllers/place_controllers");


router.get("/", placeControllers.place_get);
router.post("/details", placeControllers.place_details_post);
router.put("/:id", placeController.update);
router.delete("/place/:id", (req, res, next) => {
  Place.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;
