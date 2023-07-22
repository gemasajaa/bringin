const guniqebytime = (timestring)=>{
	const seed = 'AaBbCcDdEeFfJjKkGgHhJjKkLlMmOoPpQqRrSsTtUuVvWwXxYyZz';
	let result = '';
	for(let i of timestring){
		result += seed[Number(i)];
		result += seed[Math.floor(Math.random()*seed.length)];
	}
	return result;
}
module.exports = function(req,res,db){
	req.on('data',async data=>{
		data = JSON.parse(data.toString());
		
		//generate a id for the post.
		const time = new Date().getTime();
		const postId = guniqebytime(String(time));
		data.postId = postId;
		
		//time to save the data.
		const err = await db.ref(`post/${postId}`).update(data);
		
		if(!err){
			return res.json({ok:true,postId});
		}
		
		res.json({ok:false});
	})
}