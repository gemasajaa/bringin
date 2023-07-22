const fs = require('fs');

module.exports = {
	do(req,res){
		this[req.path](req.query.fn,res,req.query.dir);
	},
	"/scripts"(fn,res){
		res.file(`./more/public/scripts/${fn}.js`,{'content-type':'text/javascript'});
	},
	"/styles"(fn,res){
		res.file(`./more/public/styles/${fn}.css`,{'content-type':'text/css'});
	},
	"/file"(fn,res,cDir='public/media',type={'content-type':'image/png'}){
		//handline filetype.
		res.file(`./more/${cDir}/${fn}`,type);
	}
}