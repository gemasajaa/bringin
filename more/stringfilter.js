module.exports = function(anomalistring,toremove,tothis){
	while(anomalistring.indexOf(toremove)!=-1){
		anomalistring = anomalistring.replace(toremove,tothis);
	}
	return anomalistring;
}