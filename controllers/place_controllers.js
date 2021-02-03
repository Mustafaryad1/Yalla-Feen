// joi 

const Place = require("../models/place_model");
const Comment = require("../models/comment_model");
const Category = require("../models/category_model");
const upload = require("../middleware/upload").upload;
const placeImageUrl = require('dotenv').config().parsed.PLACEIMAGESURL;


const addPlace = (req, res) => {
  upload.array('images',12)(req,res,async function(err){
    if(err){
      return res.status(400).send({
          success:false,
          message:"allowed files are images and size 2mb and max-files 12 image"})
      }
   
    const body = JSON.parse(JSON.stringify(req.body));
    if (!body) {
      return res.status(400).json({
        success: false,
        error: "You must add place",
      });
    }
    // console.log(req.files);
    const category = await Category.findOne({'title':body.category})
    if(!category){
      res.send({success:false,error:"category not found"})
    }
    body.category = category._id
    const place = new Place(body);
    for(item of req.files){
      place.images.push(placeImageUrl+item.filename);
    }
    if (!place) {
      return res.status(400).json({
        success: false,
        error: err
      });
    }
    place.owner = req.user._id;
    place
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: place._id,
          message: "Place item created",
        });
      })
      .catch((error) => {
        return res.status(400).json({
          error,
          message: "Place item not created",
        });
      })
  })
};

const getAllPlaces = async (req, res) => {
  await Place.find({}).populate({
    path: 'owner',
    select: 'username'
  }).populate({
    path:'comments',
    select:'text',
    populate:{
      path:"user",
      select:"username"
    }
  }).populate({path:'category',select:"title"}).exec((err, places) => {
    if (err) {
      return res.status(400).send({
        success: false,
        error: err
      });
    }
    if (!places.length) {
      return res.status(404).send({
        success: false,
        error: `Place not found`
      });
    }
    return res.status(200).send({
      success: true,
      data: places
    });
  });
};



const getPlaceDetails = async (req, res) => {
  const result = await Place.findById(req.params.id);
  res.send(result);
};


const updatePlace = async (req, res) => {
  let {
    ...data
  } = req.body;
  const result = await Place.findById({
    _id: req.params.id
  }, data, {
    new: true,
  });
  res.send(result);
};

const deletePlace = async (req, res) => {
  Place.findByIdAndDelete({
      _id: req.params.id
    })
    .then((data) => res.json(data))
    .catch(next);
  res.send("Delete " + result);
}

const addCommentToPlace = async (req, res) => {

 
  const place = await Place.findById(req.params.id).catch(
    err=> res.send({success:false,message: "place not exist"}
    
    ));
  
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must add comment",
    });
  }
  const comment = new Comment(body);
  if (!comment) {
    return res.status(400).json({
      success: false,
      error: err
    });
  }
  comment.user = req.user._id;
  comment
    .save()
    .then((comment) => {
      place.comments.push(comment._id)
      place.save();
      console.log(comment.populate('user'));
      return res.status(200).json({
        success: true,
        id: comment._id,
        message: "Comment item created",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Comment item not created",
      });
    });


}

module.exports = {
  addPlace,
  getAllPlaces,
  updatePlace,
  deletePlace,
  addCommentToPlace,
  getPlaceDetails
};
