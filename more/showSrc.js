const dog = require('./dog');

module.exports = async function(req,res){
  const link = req.query.link+'?player=2';
  res.send(JSON.stringify({
    valid:true,
    link:await dog.getVideoSrc(link)
  }))
}
