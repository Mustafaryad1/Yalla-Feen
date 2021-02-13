// joi 

const PlaceAdsAds = require("../models/advertise _model");
const Category = require("../models/category_model");
const upload = require("../middleware/upload").upload;
const placeAdsImageUrl = require('dotenv').config().parsed.PLACEAdsIMAGESURL;

const Nominatim = require('nominatim-geocoder');
const { Mongoose } = require("mongoose");
const geocoder = new Nominatim()

const createPlaceAds = (req, res) => {
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
        error: "You must add placeAds",
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

    const placeAds = new PlaceAds(body);
    if (!placeAds) {
      return res.status(400).json({
        success: false,
        error: err
      });
    }
    if (!body.location) {
      await geocoder.search({
          q: placeAds.title
        })
        .then((response) => {
          // data =  
          console.log(response);
          placeAds.location.coordinates = [parseFloat(response[0].lon),
            parseFloat(response[0].lat)
          ]
        })
        .catch((error) => {
          err = error;
        })

      console.log(placeAds.location.coordinates);
    }
    // res.send({location:body.location})
    placeAds.location.coordinates = body.location
    if (req.files) {
      for (item of req.files) {
        placeAds.images.push(placeAdsImageUrl + item.filename);
      }
    }
    console.log(placeAds);

    placeAds.owner = req.user._id;
    placeAds
      .save()
      .then(async (data) => {
        category.placeAdss.push(data._id);
        await category.save()
        return res.status(200).json({
          success: true,
          id: placeAds._id,
          message: "PlaceAds item created",
        });
      })
      .catch((error) => {
        return res.status(400).json({
          error,
          message: "PlaceAds item not created",
        });
      })
  })
};

const getAllPlaceAds = async (req, res) => {
  var mysort = { title: 1 };  
  await PlaceAds.find({}).sort(mysort).populate({
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
  }).exec((err, placeAdss) => {
    if (err) {
      return res.status(400).send({
        success: false,
        error: err
      });
    }
    if (!placeAdss.length) {
      return res.status(404).send({
        success: false,
        error: `PlaceAds not found`
      });
    }
    return res.status(200).send({
      success: true,
      data: placeAdss
    });
  });
};

const updatePlaceAds = async (req, res) => {

  await PlaceAds.findByIdAndUpdate(
    req.params.id,
    req.body, {
      new: true
    },
    (err, placeAds) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        });
      }
      res.send({
        success: true,
        message: placeAds
      })
    }
  )
  res.send(req.placeAds);
};

const deletePlaceAds = (req, res) => {
  PlaceAdsAds.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) {
        res.send({
          succes: false,
          message: "Ads not found"
        })
      }
      res.send({
        succes: true,
        message: `${data.title} Ads deleted`,
      })
    })
    .catch(err => {
      res.send({
        succes: false,
        error: err
      })
    });

}


module.exports = {
  createPlaceAds,
  getAllPlaceAds,
  updatePlaceAds,
  deletePlaceAds
};
