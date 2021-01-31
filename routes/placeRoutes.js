const router = require("express").Router();
const placeControllers = require("../controllers/place_controllers");
const {requireAuth,grantAccess} =  require('../middleware/authMiddleware')

router.get("/", placeControllers.getAllPlaces);
router.get("/:id", placeControllers.getPlaceDetails);
router.post("/create", requireAuth,placeControllers.addPlace);
router.put("/:id", placeControllers.updatePlace);
router.delete("/place/:id", (req, res, next) => {
  Place.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

// add comment to place
router.post("/create-comment/:id",requireAuth,placeControllers.addCommentToPlace);

module.exports = router;
