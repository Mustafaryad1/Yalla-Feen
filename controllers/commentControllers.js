const Comment = require('../models/comment_model');

exports.createComment = (req,res)=>{
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must add comment",
    });
  }
  
  const comment = new Comment(body);
  if (!comment) {
    return res.status(400).json({ success: false, error: err });
  }
  comment.user=req.user._id;
  comment
    .save()
    .then((comment) => {
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

exports.getUserComments = async(req,res)=>{
  
  const comments = await Comment.find({user:req.user._id}).populate({path:'user',select:'username'}).exec()
  res.send({comments})
}

exports.updateComment = async(req,res)=>{
  const comment_id = req.params.id;
  const comment = await Comment.findById(comment_id);
  if(req.user._id.toString() === comment.user.toString()){
    console.log('ok your are the person who create comment');
  }else{
    res.send({baduser:"this is not your comment"})
  }
  res.send({comment})
}

exports.deleteComment = async(req,res)=>{
  const comment_id = req.params.id;
  const comment = await Comment.findById(comment_id);
  if(req.user._id.toString() === comment.user.toString()){
    console.log('ok your are the person who create comment');
  }else{
    res.send({baduser:"this is not your comment"})
  }
  res.send({comment})
}