const view = require('./view');
const fm = require('./fileH');
const db = require('./firebase');
const handleNewPost = require('./newpost');

module.exports = [
	{
		mM:'get',
		'/'(req,res){
			view.go('index',req,res);
		}
	},
	{
		mM:'get',
		'/scripts'(req,res){
			fm.do(req,res);
		}
	},
	{
		mM:'get',
		'/styles'(req,res){
			fm.do(req,res);
		}
	},
	{
		mM:'get',
		'/file'(req,res){
			fm.do(req,res);
		}
	},
	{
		mM:'post',
		'/newpost'(req,res){
			handleNewPost(req,res,db);
		}
	},
	{
		mM:'get',
		async '/loadstories'(req,res){
			let data = await db.ref('post').get();
			data = data.val();
			res.json(data);
		}
	}
];
