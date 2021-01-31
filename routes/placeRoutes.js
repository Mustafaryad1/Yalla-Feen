const router = require("express").Router();
const placeControllers = require("../controllers/place_controllers");

router.get("/places", placeControllers.getAllPlaces);
router.post("/addplace", placeControllers.addPlace);
// router.get("/details/:id", placeControllers.getPlacesDetails);
router.put("/:id", placeControllers.updatePlace);
router.delete("/delete/:id", placeControllers.deletePlace);


module.exports = router;
