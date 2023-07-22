
module.exports = function(req,res,db){
	req.on('data',data=>{
		req.body = JSON.parse(data.toString());
		const userId = req.body.email.split('@')[0];
		db.ref(`users/${userId}`).get().then((data)=>{
			const newData = data.val()||{};
			if(newData.email){
				if(newData.password===req.body.password){
					delete newData.password;
					res.json({
						valid:true,
						msg:newData
					})
				}else{
					res.json({valid:false,msg:'Wrong Password'})
				}
			}else{
				res.json({
					valid:false,msg:'Account Not Found'
				})
			}
		})	
	})
}