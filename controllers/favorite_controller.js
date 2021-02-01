const Favorite = require('../models/favorite_model');

exports.createFavorite = (req,res)=>{
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must add Favorite",
    });
  }
  
  const favorite = new Favorite(body);
  if (!favorite) {
    return res.status(400).json({ success: false, error: err });
  }
  favorite.user=req.user._id;
  favorite
    .save()
    .then((favorite) => {
      console.log(favorite.populate('user'));
      return res.status(200).json({
        success: true,
        id: favorite._id,
        message: "favorite item created",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "favorite item not created",
      });
    });
}

exports.getUserFavorites = async(req,res)=>{
  
  const favorites = await Favorite.find({user:req.user._id}).populate({path:'user',select:'username'}).exec()
  res.send({favorites});
}



exports.deleteFavorite = async(req,res)=>{
  const favorite_id = req.params.id;
  const favorite = await Favorite.findById(favorite_id);
  if(req.user._id.toString() === favorite.user.toString()){
    console.log('ok your are the person who create favorite');
  }else{
    res.send({baduser:"this is not your favorite"})
  }
  res.send({favorite})
}