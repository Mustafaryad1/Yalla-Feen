const router = require("express").Router();
const placeControllers = require("../controllers/place_controllers");
const {requireAuth,grantAccess,checkPlaceOwner} =  require('../middleware/authMiddleware');
const { upload } = require("../middleware/upload");
const validation_body = require('../middleware/validationBody')
const place = require('../validation-schema/place')


router.get("/list", placeControllers.getAllPlaces);
router.get("/my-places",requireAuth,placeControllers.getOwnerPlaces);
router.get("/details/:id",placeControllers.getPlaceDetails);
router.get("/place-title/:title",placeControllers.placeSearch);
router.get("/find/:category/:tagTitle",placeControllers.customFilter);
router.get("/search",placeControllers.customSearch);
router.post("/create", requireAuth,placeControllers.addPlace);

router.put("/update/:id",requireAuth,checkPlaceOwner,placeControllers.updatePlace);

router.delete("/delete/:id",requireAuth,checkPlaceOwner,placeControllers.deletePlace);


// add comment to place/crate-comment/place_id
router.post("/create-comment/:id",requireAuth,placeControllers.addCommentToPlace);

// add tag to place
router.post("/add-tag/:id",requireAuth,placeControllers.addTagToPlace);

// add rating place/add-rating/place_id
router.post("/add-rating/:id",requireAuth,placeControllers.addRatingToPlace);
router.post("/nearst",placeControllers.nearstPlaces);

// // look at place images
// router.post('/images',(req,res)=>{
//   upload.array('images',12)(req,res,function(err){
//     if(err){
//       return res.status(400).send({
//           success:false,
//           message:"allowed files are images and size 2mb and max-files 12 image"})
//       }
//     console.log(req.files);
//     const body = JSON.parse(JSON.stringify(req.body));
//     console.log(body);
//     res.send({success:true,message:"i got them"})
//   })
  
 
// })
 
module.exports = router;
