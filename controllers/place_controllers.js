const Place = require("../models/place_model");
const Comment = require("../models/comment_model");

const addPlace = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must add place",
    });
  }

  const place = new Place(body);

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
    });

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
  }).exec((err, places) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err
      });
    }
    if (!places.length) {
      return res.status(404).json({
        success: false,
        error: `Place not found`
      });
    }
    return res.status(200).json({
      success: true,
      data: places
    });
  }).catch((err) => console.log(err));
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

  const place_id = req.params.id;
  const place = await Place.findById(place_id)
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
      place.comments.push(comment)
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
  addCommentToPlace
};
