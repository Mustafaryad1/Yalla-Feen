const Place = require("../models/place_model");

addPlace = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must add place",
    });
  }

  const place = new Place(body);

  if (!place) {
    return res.status(400).json({ success: false, error: err });
  }

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
//   Place.create({
//         title: req.body.title,
//         description: req.body.description,
//         location: req.body.location,
//         type: req.body.type,
//         tags: req.body.tags,
//         workStart: req.body.workStart,
//         workEnd: req.body.workEnd,
//         vistorType: req.body.vistorType,
//         budgetType: req.body.budgetType,
//         phone: req.body.phone,
//         placeImages: req.body.placeImages,
//     },
//     (err, place) => {
//         if (err) res.status(500).send(err)
//         res.status(200).send(place)
//     })
};

getAllPlaces = async (req, res) => {
  await Place.find({}, (err, places) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!places.length) {
      return res.status(404).json({ success: false, error: `Place not found` });
    }
    return res.status(200).json({ success: true, data: places });
  }).catch((err) => console.log(err));
};

updatePlace = async (req, res) => {
  let { ...data } = req.body; 
  const result = await Place.findById({ _id: req.params.id }, data, {
    new: true,
  });
  res.send(result);
};

deletePlace = async (req, res) => {
  Place.findByIdAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
    res.send("Delete " + result);
  }

module.exports = { addPlace, getAllPlaces, updatePlace, deletePlace };
