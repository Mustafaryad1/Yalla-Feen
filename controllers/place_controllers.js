// joi 

const Place = require("../models/place_model");
const Comment = require("../models/comment_model");
const Category = require("../models/category_model");
const Rating = require("../models/rating_model");
const upload = require("../middleware/upload").upload;
const Tags = require("../models/tags_model");
const placeImageUrl = require('dotenv').config().parsed.PLACEIMAGESURL;

// const { find } = require("../models/place_model");
// const { randomBytes } = require("crypto");

const Nominatim = require('nominatim-geocoder');
const { Mongoose } = require("mongoose");
const geocoder = new Nominatim()



const addPlace = (req, res) => {
  upload.array('images', 12)(req, res, async function (err) {
    if (err) {
      return res.status(400).send({
        success: false,
        message: "allowed files are images and size 2mb and max-files 12 image"
      })
    }

    const body = JSON.parse(JSON.stringify(req.body));

    if (!body) {
      return res.status(400).json({
        success: false,
        error: "You must add place",
      });
    }
    // console.log(req.files);
    const category = await Category.findOne({
      'title': body.category
    })
    if (!category) {
      res.send({
        success: false,
        error: "category not found"
      })
    }
    body.category = category._id

    const place = new Place(body);
    if (!place) {
      return res.status(400).json({
        success: false,
        error: err
      });
    }
    if (!body.location) {
      await geocoder.search({
          q: place.title
        })
        .then((response) => {
          // data =  
          console.log(response);
          place.location.coordinates = [parseFloat(response[0].lon),
            parseFloat(response[0].lat)
          ]
        })
        .catch((error) => {
          err = error;
        })

      console.log(place.location.coordinates);
    }
    // res.send({location:body.location})
    place.location.coordinates = body.location
    if (req.files) {
      for (item of req.files) {
        place.images.push(placeImageUrl + item.filename);
      }
    }
    console.log(place);

    place.owner = req.user._id;
    place
      .save()
      .then(async (data) => {
        category.places.push(data._id);
        await category.save()
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

const getRelatedPlaces = async (req, res) => {
  var query = { category: req.params.id };
  await Place.find(query).limit(3).populate({
    path: 'owner',
    select: 'username'
  }).populate({
    path: 'comments',
    select: 'text',
    populate: {
      path: "user",
      select: "username"
    }
  }).populate({
    path: 'category',
    select: "title"
  }).populate({
    path: 'tags',
    select: 'title'
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

const getAllPlaces = async (req, res) => {
  const {skip=0,limit=0} = req.query
  console.log(skip,limit);
  await Place.find({}).skip(parseInt(skip)).limit(parseInt(limit)).populate({
    path: 'owner',
    select: 'username'
  }).populate({
    path: 'comments',
    select: 'text',
    populate: {
      path: "user",
      select: "username"
    }
  }).populate({
    path: 'category',
    select: "title"
  }).populate({
    path: 'tags',
    select: 'title'
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

const getTopRatedPlaces = async (req, res) => {
  var mysort = { rates: -1 };  
  await Place.find({}).sort(mysort).populate({
    path: 'owner',
    select: 'username'
  }).populate({
    path: 'comments',
    select: 'text',
    populate: {
      path: "user",
      select: "username"
    }
  }).populate({
    path: 'category',
    select: "title"
  }).populate({
    path: 'tags',
    select: 'title'
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

const getOwnerPlaces = async (req, res) => {

  await Place.find({
    'owner': req.user._id
  }, (err, places) => {
    // console.log(req.user._id);
    if (err) {
      res.send({
        success: false,
        err
      })
    }
    res.send({
      places
    })
  }).populate({
    path: 'comments',
    select: ['text', 'createdAt'],
    populate: {
      path: "user",
      select: "username"
    }
  }).populate().exec()


}

const getPlaceDetails = async (req, res) => {
  // console.log('im in place details');

  const result = await Place.findById(req.params.id).populate({
    path: 'comments',
    select: ['text', 'createdAt'],
    populate: {
      path: "user",
      select: ["username", "avatar"]
    }
  }).populate().exec();
  res.send(result);
};

const placeSearch = async (req, res) => {
  // console.log('im in place details');
  title = req.params.title.toLowerCase();
  const result = await Place.findOne({
    'title': {
      "$regex": title
    }
  }).populate({
    path: 'comments',
    select: ['text', 'createdAt'],
    populate: {
      path: "user",
      select: ["username", "avatar"]
    }
  }).populate().exec();
  if (!result) {
    res.status(404).send({
      success: false,
      message: "place not found"
    })
  }
  res.send({
    success: true,
    id: result._id
  });
};

const customFilter = async (req, res) => {
  const {
    category,
    tagTitle
  } = req.params;
  const tag = await Tags.findOne({
      'title': tagTitle
    })
    .catch()
  const result = await Category
    .find({
      'title': category
    })
    .populate({
      path: 'places',
      select: ['title', 'description'],
      match: {
        'tags': {
          "$in": [tag._id, ]
        }
      },
      populate: {
        path: 'tags',
        select: "title"
      }
    })
    .exec()



  if (result.length == 0) {
    res.send({
      success: false,
      message: "Sorry not found yet"
    })
  }

  res.send({
    success: true,
    message: "founded",
    data: result,
    tag: tag
  })


}

const customSearch = async (req, res) => {
  // console.log(req.query);

  let {category,type,city,budget,tag}=req.query;
  const place_category = await Category.findOne({'title':category});
  // const place_tag = await Tags.findOne({'title':tag});
  // console.log(place_tag);
  city = (city=='x')?'':city
  budget = (budget=='x')?101:budget
  // console.log(budget);
  const places = await Place.find({'category':place_category._id,
                                   'type':type,
                                   'minBudget':{'$lt':budget}},
                                  
                                   //  'tags':{"$in":place_tag._id}}
                                  )
                            .find({'city':{"$regex":city}})
                          
  res.send({places})

}
// //stash
// const searchByRating = async (req, res) => {
//   // console.log('im in place details');

//   const result = await Place.findOne({:req.params.rating}).populate({
//     path:'comments', 
//     select:['text','createdAt'],
//     populate:{
//         path:"user",
//         select:["username","avatar"]}
//       }).populate().exec();
//   if(!result){
//     res.status(404).send({success:false,message:"place not found"})
//   }
//   res.send({success:true,id:result._id});
// };
// //

const updatePlace = async (req, res) => {

  await Place.findByIdAndUpdate(
    req.params.id,
    req.body, {
      new: true
    },
    (err, place) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        });
      }
      res.send({
        success: true,
        message: place
      })
    }
  )
  res.send(req.place);
};

const deletePlace = (req, res) => {
  Place.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) {
        res.send({
          succes: false,
          message: "place not found"
        })
      }
      res.send({
        succes: true,
        message: `${data.title} place deleted`,
      })
    })
    .catch(err => {
      res.send({
        succes: false,
        error: err
      })
    });

}

const addCommentToPlace = async (req, res) => {


  const place = await Place.findById(req.params.id).catch(
    err => res.send({
        success: false,
        message: "place not exist"
      }

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

const addTagToPlace = async (req, res) => {
  const place = await Place.findById(req.params.id).catch(
    err => res.send({
        success: false,
        message: "place not exist",
        errors: err
      }

    ));
    const body = req.body
    if (!body.title) {
      return res.status(400).json({
        success: false,
        error: "You must add Tag Name",
      });
    }
    let tag = await Tags.findOne({
      'title': body.title
    }) // null or tag
    // console.log(tag);
    if (!tag) {
      // console.log(tag);
      //  return res.send({success:false,message: "Tag not exist in tags "})
      tag = new Tags(body);
      // console.log(tag)
      await tag.save()
    }
    
  // const category = await Category.findById(place.category)
  await Place.updateOne({'_id':place._id},{"$addToSet":{'tags':tag._id}})
  await Category.updateOne({'_id':place.category},{"$addToSet":{'tags':tag._id}})
  await Tags.updateOne({'_id':tag._id},{"$addToSet":{'places':place._id}})
  // const exist = await place.tags.filter(
  //   place_tag_id => place_tag_id.toString() === tag._id.toString())
  // if (exist.length != 0) {
  //   return res.send({
  //     success: false,
  //     message: "Tag  exist in place tags "
  //   })
  // }
  // place.tags.push(tag._id)
  // await place.save()
  // await tag.save()

  res.send({
    success: true,
    message: "Tag has been added",
    tagid:tag._id,
    placeid:place._id,
    category:place.category
  })
}

const addRatingToPlace = async (req, res) => {
  // console.log(req.user,req.params.id);
  // console.log('start');
  let place = await Place.findOne({'_id':req.params.id})
                         .catch(err => res.status(404).send({success:false,message:"Place not Found"})) // return null or return object 
  if(!place){
    res.status(404).send({success:false,message:"Place not Found"})
  }  
  // console.log(place);
  const place_user_rate = await Rating.findOne({
    user: req.user._id,
    place: req.params.id
  })
  // console.log(place_user_rate);
  if (!req.body.rate_value) {
    res.send({
      success: false,
      message: "you should add rating value"
    });
  }
  // // console.log(req.body);
  // let rates = 0
  let rating;
  if (!place_user_rate) {
  //   // console.log("yes it's first time");
  rating = new Rating(req.body);
  //   // console.log(rating);
    rating.user = req.user._id;
    rating.place = place._id;
    await rating.save().catch(err => {
      res.status(400).send({
            success:false,message:"value not valid you should enter one value from [0,1,2,3,4,5]"
      })})
    await Place.updateOne({'_id':place._id},{"$addToSet":{'rating':rating._id}})
    
    }
    else{
    //  rating =  await Rating.updateOne({'user':req.user._id,'place':place._id},{'rate_value':req.body.rate_value});
      place_user_rate.rate_value = req.body.rate_value;
      await place_user_rate.save().catch(err =>
        res.send({
          success:false,message:"value not valid you should enter one value from [0,1,2,3,4,5]"})
        )
    }
     let [{rates}]= await Rating.aggregate(
      [{
        $match:{
            place:place._id
      }},
        {
          $group: {
            _id: "$place",
            rates: {
              $sum: "$rate_value"
            }
          }
        }
      ],
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          return result
        }
      }
    );
  let place_rates = Math.ceil(rates/place.rating.length)
  // res.send({place_rates})
  await Place.updateOne({'_id':place._id},{'rates':place_rates})
  res.send({succes:true,place_rates})

}

const nearestPlaces = async (req, res) => {
  if (!req.body.place) {
    res.send({
      success: false,
      message: "enter place"
    })
  }
  await geocoder.search({
      q: req.body.place
    })
    .then((response) => {
      // data =  
      console.log(response);
      coordinates = [parseFloat(response[0].lon),
        parseFloat(response[0].lat)
      ]
      Place.find({
          location: {
            $near: {
              type: 'Point',
              coordinates: coordinates
            }
          }
        },
        function (err, docs) {
          if (err) return res.send({
            err
          });
          res.send({
            coordinates,
            docs
          });
          // done();
        }).exec()
    })
    .catch((error) => {
      err = error;
    })
}


module.exports = {
  addPlace,
  getAllPlaces,
  getRelatedPlaces,
  getTopRatedPlaces,
  updatePlace,
  deletePlace,
  addCommentToPlace,
  addTagToPlace,
  addRatingToPlace,
  getPlaceDetails,
  getOwnerPlaces,
  nearestPlaces,
  placeSearch,
  customFilter,
  customSearch
};
