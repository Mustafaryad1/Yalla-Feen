const router = require("express").Router();
const tagsControllers = require("../controllers/tags_controllers");

router.get("/list", tagsControllers.getAllTags);
router.post("/create", tagsControllers.addTags);
router.get("/places/:id", tagsControllers.getAllPlaces);
router.delete("/tags/:id", (req, res, next) => {
  Place.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});  // need modified just admin 

module.exports = router;
