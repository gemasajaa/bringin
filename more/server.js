const server = require('./flexserve');
const routes = require('./routes');
//can define it well, here.
server.Routes.invalidHandle = function(res){
	res.string(404);
}
//server routing is fine.
server.setRoutes(routes);

server.start(8080,()=>{console.log('server running on port 8080')});