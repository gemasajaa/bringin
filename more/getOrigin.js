module.exports = function(req){
	return `${req.headers.host==='localhost:8080'?'http':'https'}://${req.headers.host}`;
}