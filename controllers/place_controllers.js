module.exports.place_get = (req,res)=>{
  res.send({places:req.body})

}

module.exports.place_details_post = (req,res)=>{
  res.send({data:req.body})
}

