const router = require("express").Router();
const categoryControllers = require("../controllers/category_controllers");

// just admin 

router.get("/list", categoryControllers.getAllCategoryes);
router.post("/create", categoryControllers.addCategory);
router.get("/places/:id", categoryControllers.getAllPlaces);
router.delete("/category/:id", (req, res, next) => {
  Place.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;
