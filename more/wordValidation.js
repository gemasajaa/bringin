const validate = function(worda,wordb){
	let point = 0;
	worda.split('').forEach(a=>{
		wordb.split('').forEach(b=>{
			if(a===b)point++;
		})
	})
	return point/worda.length;
}

const sentenceValidate = function(A,B,rate){
	let point = 0;
	A = A.split(' ');
	B = B.split(' ');
	A.forEach(sentenceA=>{
		B.forEach(sentenceB=>{
			if(validate(sentenceA.toLowerCase(),sentenceB.toLowerCase())>=rate){
				point++;
			}
		})
	})
	return point/A.length;
}

console.log(sentenceValidate('jimmy','Tom and jerry apa kabar',1));