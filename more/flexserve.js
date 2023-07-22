//flexserve, gema from infinitydreams.
const http = require('http');
const fs = require('fs');

module.exports = {
	http,
	Routes:{
		get:{
			'/'(req,res){
				res.end('Welcome to the web!');
			}
		},
		post:{},
		invalid(res){
			if(this.invalidHandle){
				this.invalidHandle(res);
			}else{
				res.end('Invalid Req');
			}
		}
	},
	setRoutes(routes){
		routes.forEach(r=>{
			this.Routes[r.mM][Object.keys(r)[1]] = r[Object.keys(r)[1]];
		})
	},
	start(port,callback){
		this.http.createServer((req,res)=>{
			//set new function to res.
			Object.assign(req,this.codeToInjectReq);
			Object.assign(res,this.codeToInjectRes);
			this.handleReq(req,res);
		}).listen(port);
		if(callback)callback();
	},
	async handleReq(req,res){
		await req.parse();
		if(this.Routes[req.method.toLowerCase()][req.path]){
			this.Routes[req.method.toLowerCase()][req.path](req,res);
		}else this.Routes.invalid(res);
	},
	codeToInjectRes:{
		json(jsoncode,status=200,HeadConfiguration={'content-type':'application/json'}){
			this.writeHead(status,HeadConfiguration);
			this.end(JSON.stringify(jsoncode));
		},
		string(something,status=200,HeadConfiguration={'content-type':'text/html'}){
			this.writeHead(status,HeadConfiguration);
			this.end(something.toString());
		},
		async file(url,configurationHeader={'content-type':'text/html'}){
			fs.exists(url,(exist)=>{
				this.writeHead(200,configurationHeader);
				if(exist)fs.createReadStream(url).pipe(this);
				else this.json({err:true,msg:'file not found!'})
			})
		}
	},
	codeToInjectReq:{
		//code this later, its fine.
		//make parsing req, function.
		//goal is to parse path, query from url.
		parse(){
			this.path = this.url.slice(0,this.url.indexOf('?')!=-1?this.url.indexOf('?'):this.url.length);
			//parsing query.
			this.query = {};
			if(this.url.indexOf('?')!=-1){
				const queryBase = this.url.slice(this.url.indexOf('?')+1,this.url.length).split('&&');
				queryBase.forEach(query=>{
					if(query.indexOf('=')!=-1){
						this.query[query.split('=')[0]] = query.split('=')[1];
					}
				})
			}
			//setting up header.
			this.header = {};
			for(let i=0;i<this.rawHeaders.length;i+=2){
				this.header[this.rawHeaders[i]] = this.rawHeaders[i+1];
			}
			//handling post req.
			// this.on('data',(data)=>{
			// 	if(this.header['content-type']==='application/json'){
			// 		this.body = JSON.parse(data.toString());
			// 	}else this.body = data.toString();
			// })
		}
	}
};







