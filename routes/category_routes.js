const router = require("express").Router();
const categoryControllers = require("../controllers/category_controllers");

router.get("/", categoryControllers.getAllCategoryes);
router.post("/create", categoryControllers.addCategory);
router.delete("/category/:id", (req, res, next) => {
  Place.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;
