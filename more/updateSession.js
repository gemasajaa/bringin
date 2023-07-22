module.exports = function(req,res,db){
  req.on('data',data=>{
    const userData = JSON.parse(data.toString());
    const userId = userData.email.split('@')[0];
    db.ref(`users/${userId}`).get().then(dbdata=>{
      const valuedData = dbdata.val();
      res.json(valuedData);
    })
  })
}