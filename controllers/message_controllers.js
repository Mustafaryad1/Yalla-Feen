const Message = require('../models/message_model');

exports.createMessage = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must add message",
    });
  }

  const message = new Message(body);
  if (!message) {
    return res.status(400).json({
      success: false,
      error: err
    });
  }
  message.user = req.user._id;
  message
    .save()
    .then((message) => {
      console.log(message.populate('user'));
      return res.status(200).json({
        success: true,
        id: message._id,
        message: "Message item created",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Message item not created",
      });
    });
}

exports.getMessages = async (req, res) => {

  const messages = await Comment.find({
    user: req.user._id
  }).populate({
    path: 'user',
    select: 'username'
  }).exec()
  res.send({
    messages
  })
}

exports.deleteMessage = async (req, res) => {
  const message_id = req.params.id;
  try {
    const message = await Message.findById(message_id);
    if (req.user._id.toString() === message.user.toString()) {
      await Message.findByIdAndDelete({
          _id: message_id
        })
        .then(data => res.send({
          success: true,
          message: "Message has been deleted"
        }))
        .catch(err => res.send({
          err
        }))
    } else {
      res.send({
        baduser: "this is not your message"
      })
    }
    res.send({
        message
    })
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Message not found"
    })
  }
}

//admin controllers
