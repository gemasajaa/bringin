module.exports = function(src,obj){
	for(let i of obj){
		delete src[i];
	}
}