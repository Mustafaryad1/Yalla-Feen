const router = require("express").Router();
const placeControllers = require("../controllers/place_controllers");
const {requireAuth,grantAccess} =  require('../middleware/authMiddleware');
const { upload } = require("../middleware/upload");

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

// look at place images
router.post('/images',(req,res)=>{
  upload.array('images',12)(req,res,function(err){
    if(err){
      return res.status(400).send({
          success:false,
          message:"allowed files are images and size 2mb and max-files 12 image"})
      }
    console.log(req.files);
    const body = JSON.parse(JSON.stringify(req.body));
    console.log(body);
    res.send({success:true,message:"i got them"})
  })
  
 
})
 
module.exports = router;
