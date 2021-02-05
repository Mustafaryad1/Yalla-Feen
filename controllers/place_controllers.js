// joi 

const Place = require("../models/place_model");
const Comment = require("../models/comment_model");
const Category = require("../models/category_model");
const Rating = require("../models/rating_model");
const upload = require("../middleware/upload").upload;
const Tags = require("../models/tags_model");
const placeImageUrl = require('dotenv').config().parsed.PLACEIMAGESURL;

const { find } = require("../models/place_model");
const { randomBytes } = require("crypto");

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
    if (!place) {
      return res.status(400).json({
        success: false,
        error: err
      });
    }
    if(req.files){
    for(item of req.files){
      place.images.push(placeImageUrl+item.filename);
    }}
   
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
  }).populate({
    path:'category',
    select:"title"
  }).populate({
    path:'tags',
    select:'title'
  }).exec((err, places) => {
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

const getOwnerPlaces = async(req,res)=>{
  
  await Place.find({'owner':req.user._id},(err,places)=>{
    // console.log(req.user._id);
    if(err){
      res.send({success:false,err})
    }
    res.send({places})
  }).populate({
    path:'comments',
    select:['text','createdAt'],
    populate:{
        path:"user",
        select:"username"}
      }).populate().exec()

  
}

const getPlaceDetails = async (req, res) => {
  // console.log('im in place details');
  const result = await Place.findById(req.params.id).populate({
    path:'comments',
    select:['text','createdAt'],
    populate:{
        path:"user",
        select:["username","avatar"]}
      }).populate().exec()
;
  res.send(result);
};


const updatePlace = async (req, res) => {
  
  await Place.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true},
    (err,place)=>{
      if(err){
      return res.status(500).send({success:false,message:err});
      }
      res.send({success:true,message:place})
    }
  )
  res.send(req.place);
};

const deletePlace =  (req, res) => {
  Place.findByIdAndDelete(req.params.id)
    .then((data) => {
      if(!data){
        res.send({succes:false,message:"place not found"})
      }
      res.send({succes:true,message:"place deleted",data:data})
    })
    .catch(err =>{res.send({succes:false,error:err})});
  
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

const addTagToPlace = async(req,res) =>{
  const place = await Place.findById(req.params.id).catch(
    err => res.send({success:false,message: "place not exist",errors:err}
    
    ));
  const body = req.body
  if(!body.title){
    return res.status(400).json({
      success: false,
      error: "You must add Tag Name",
    });
  }
  let tag = await Tags.findOne({'title':body.title}) // null or tag
  // console.log(tag);
  if(!tag){
    // console.log(tag);
  //  return res.send({success:false,message: "Tag not exist in tags "})
    tag =  new Tags(body);
    // console.log(tag)
    await tag.save()
  }
  
  const exist = await place.tags.filter(
    place_tag_id => place_tag_id.toString() === tag._id.toString())
  if(exist.length !=0){
   return res.send({success:false,message: "Tag  exist in place tags "})
  }
  place.tags.push(tag._id)
  tag.places.push(place._id)
  await place.save()
  await tag.save()
 
  res.send({success:true,message: "Tag has been added"})
}
// user place

const addRatingToPlace = async(req,res)=>{
  // console.log(req.user,req.params.id);
    let place = await Place.findById(req.params.id).catch(err => {
      res.send({success:false,message: "place not exist"});
    }); // null in if !null==true  place
    const place_user_rate = await Rating.findOne({user:req.user._id,place:req.params.id});

    if(!req.body.rate_value){
      res.send({success:false,message: "you should add rating value"});
    }
    let rates = 0
    if(!place_user_rate){
      const rating =  new Rating(req.body);
      rating.user = req.user._id;
      rating.place = place._id;
      await rating.save().catch(err=>{res.send({err})})
      place.rating.push(rating._id)
      
    for(rateid of place.rating){
      ratedb= await Rating.findById(rateid);
      // console.log(ratedb);
      rates += ratedb.rate_value;
      // console.log(rates)
    }

      rates = Math.ceil(rates/place.rating.length)
      place.rates = rates
      await place.save()
      // res.send({place})
    }
    place_user_rate.rate_value = req.body.rate_value;

    await place_user_rate.save().catch(err=> res.send({err}));

    for(rateid of place.rating){
      ratedb= await Rating.findById(rateid);
      // console.log(ratedb);
      rates += ratedb.rate_value;
      // console.log(rates)
    }
    // console.log(rates,place.rating.length)
    // console.log(rates/place.rating.length);
    rates = Math.ceil(rates/place.rating.length);
    place.rates = rates;
    await place.save();
    res.send({place});
    
}

module.exports = {
  addPlace,
  getAllPlaces,
  updatePlace,
  deletePlace,
  addCommentToPlace,
  addTagToPlace,
  addRatingToPlace,
  getPlaceDetails,
  getOwnerPlaces
};
