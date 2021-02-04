const router = require("express").Router();
const placeControllers = require("../controllers/place_controllers");
const {requireAuth,grantAccess} =  require('../middleware/authMiddleware');
const { upload } = require("../middleware/upload");
const validation_body = require('../middleware/validationBody')
const place = require('../validation-schema/place')


router.get("/", placeControllers.getAllPlaces);
router.get("/details/:id", placeControllers.getPlaceDetails);
router.post("/create", requireAuth,placeControllers.addPlace);
router.put("/update/:id", placeControllers.updatePlace);

router.delete("/delete/:id",placeControllers.deletePlace);

// add comment to place/crate-comment/place_id
router.post("/create-comment/:id",requireAuth,placeControllers.addCommentToPlace);

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
