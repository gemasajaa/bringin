Array.prototype.getRandom = function(){
	return this[Math.floor(Math.random()*this.length)];
}
//Object.prototype.forEach = function(callback){
//	let i = 0;
//	for(let key in this){
//		callback(this[key],i);
//		i++;
//	}
//}
JSON.toEncoded = function(obj){
	let string = '';
	for(let i in obj){
		string += `${i}=${obj[i]}&&`;
	}
	return string;
}
const jsonstr = function(obj){
	return JSON.stringify(obj);
}
const filterString = function(string,char,newchar){
	while(string.indexOf(char)!=-1){
		string = string.replace(char,newchar);
	}
	return string;
}
const recheckvalue = function(el,time=1000){
	const borderColorBefore = el.style.borderColor;
	el.style.borderColor = 'red';
	setTimeout(()=>{el.style.borderColor = borderColorBefore},time);
}
const getTimestamp = function(){
	let time = new Date().toLocaleTimeString();
	let date = new Date().toLocaleDateString();
	while(time.indexOf('.')!=-1){
		time = time.replace('.','');
	}
	
	const metadate = date.split('/');
	date = '';
	metadate.reverse();
	metadate.forEach(d=>{
		if(d.length===1){
			d = 0+d;
		}
		date += d;
	})
	return(date+time);
}
//Object.prototype.len = function(){
//	let x = 0;
//	for(let i in this){x++}
//	return x-2;
//}
//Object.prototype.forEach = function(callback){
//	let i = 0;
//	for(let key in this){
//		callback(this[key],i);
//		i++;
//	}
//}
//Object.prototype.isVector = function(){
//	if(
//		this.x && typeof this.x === 'number' &&
//		this.y && typeof this.y === 'number'
//		)return true;
//	return false;
//}
//Object.prototype.VSubstract = function(vector){
//	if(this.isVector()){
//		return {x:this.x-vector.x,y:this.y-vector.y}
//	}
//}
//Object.prototype.getVector = function(){
//	if(this.isVector()){
//		const x = this.x;
//		const y = this.y;
//		return {x,y};
//	}return null;
////}
//Object.prototype.moveTo = function(vector){
//	if(this.isVector()){
//		const nvector = this.VSubstract(vector);
//		const theta = Math.atan2(nvector.y,nvector.x);
//		this.x += Math.cos(theta);
//		this.y -= Math.sin(theta);
//		return this.getVector();
//	}return false;
//}
//Object.prototype.sameVector = function(vector){
//	if(this.isVector()&&vector.isVector()){
//		if(Math.round(this.x) === Math.round(vector.x) && Math.round(this.y) === Math.round(vector.y))return true;
//		return false;
//	}
//}
//Object.prototype.update = function(obj){
//	Object.assign(this,obj);
//}
const vector2 = function(x=0,y=0){
	return {x,y};
}
const forIn = function(n,f){
	for(let i=0;i<n;i++)if(f)f(i);
}
const getRad = function(n){return n*Math.PI/180}
const vector2Dir = function(v1,v2){
	return Math.atan2(v2.x-v1.x,v2.y-v1.y);
}
const transformV = function(v1,v2){
	return vector2(v2.x-v1.x,v2.y-v1.y);
}
const getMagnitude = function(vector){
	return Math.hypot(vector.x,vector.y);
}
const random = function(len,min=0){
	return Math.floor(Math.random()*len)+min;
}
const find = function(p){
	return Object.assign(document.querySelector(p),toInject);
}
const findall = function(p){
	const els = document.querySelectorAll(p);
	for(let i=0;i<els.length;i++){
		Object.assign(els[i],toInject);
	}
	return els;
}
const flex = {
	components:[]	
}

const objlen = function(obj){
	let i = 0;
	for(let x in obj){
		i += 1;
	}
	return i;
}

const toInject = {
		find(p){
			return Object.assign(this.querySelector(p),this);
		},
		findall(p){
			const els = this.querySelectorAll(p);
			for(let i=0;i<els.length;i++){
				Object.assign(els[i],toInject);
			}
			return els;
		},
		addChild(child){
			this.appendChild(child);
			flex.components.push(child);
			if(child.onadded)child.onadded();
		},
		show(setting='block'){
			if(this.style.display === 'none' || this.style.display === ''){
				this.style.display = setting; 
			}
		},
		hide(){
			if(this.style.display !== 'none' || this.style.display !== ''){
				this.style.display = 'none';
			}
		},
		saveRemove(p){
			const el =	this.querySelector(p);
			if(el)el.remove();
		},
		clear(){
			this.innerHTML = '';
		},
		update(someupdate){
			Object.assign(this,someupdate);
		},
		setHTML(string){
			this.innerHTML = string;
		}
	}

const makeElement = function(name,optional={}){
	Object.assign(optional,toInject);
	return Object.assign(document.createElement(name),optional);
}
document.body.addChild = function(child){
	this.appendChild(child);
	if(child.onadded)child.onadded();
}

window.onresize = function(e){
	flex.components.forEach(component=>{
		if(component.onScreenChange)component.onScreenChange(e);
	})
}

const form = function(data){
	const form = new FormData();
	for(let key in data){
		form.append(key,data[key]);
	}
	return form;
}

const cOn = {
	x:new XMLHttpRequest(),
	init(){
		this.x.someSettings = [];
		this.x.getJSONResponse = ()=>{
		  return JSON.parse(this.x.responseText);
		}
	},
	post(config){
		this.init();
		Object.assign(this.x,config);
		this.x.open('POST',config.url);
		if(this.x.someSettings.length>0){
			this.x.someSettings.forEach(x=>{
				this.x[x[0]](x[1],[x[2]]);
			});
		}
		this.x.send(config.data);
	},
	get(config){
		this.init();
		Object.assign(this.x,config);
		this.x.open('GET',config.url);
		this.x.send();
	}
}
const uploadFile = function(type='readAsArrayBuffer',file,transferRate=1000,progress,callback,dataoptional={}){
	const fs = new FileReader();
	fs.onload = function(){
		const data = this.result;
		let uploaded = 0;
		let uploadedf = false;
		const send = function(){
			let start = uploaded;
			let end = start+transferRate;
			if(end>data.byteLength){
				end = end-(end-data.byteLength);
				uploadedf = true;
			}
			let chunk = data.slice(start,end);
			cOn.post({
				url:'/upload',
				someSettings:[['setRequestHeader','content-type','application/octet-stream'],
					['setRequestHeader','filedata',JSON.stringify(Object.assign({
						fname:file.name
					},dataoptional))],
				],
				data:chunk,
				onload(response){
					uploaded += chunk.byteLength;
					progress(uploaded);
					if(uploadedf){
						callback(response);
					}else send();
				}
			})
		}
		send();
		
	}
	fs[type](file);
}
const readFile = function(src,readMode,callback){
	const fr = new FileReader();
	fr[readMode](src);
	fr.onloadend = function(){
		callback(this.result);
	}
}

const getPrice = function(value){
	value = String(value);
	let result = '';
	while(true){
		if(value.length>3){
			result = '.'+value.slice(value.length-3)+result;
			value = value.slice(0,value.length-3);
		}else{
			result = value+result;
			break
		}
	}
	return result;
}
const speedywords = function(words,el,speed=1000){
	//try to work on this.
	let wIndex = 0;
	let cIndex = 0;
	const display = ()=>{
		el.innerHTML += `<span>${words[wIndex][cIndex]}</span>`;
		cIndex++;
		if(cIndex===words[wIndex].length+1){
			wIndex++;
			if(wIndex===words.length){
				wIndex = 0;
			}
			cIndex = 0;
			el.clear();
		}
	}
	const interval = setInterval(()=>{
		display();
	},speed)
}
const showElement = function(el,displaymode='flex'){
	el.style.display = displaymode;
}
const hideElement = function(el){
	el.style.display = 'none';
}
const getTime = function(){
	return new Date().getTime();
}
const getUniqueID = function(len=10){
	const seed = 'aAbBcCdDEeFfJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
	let result = '';
	for(let i=0;i<len;i++){
		result += seed[Math.floor(Math.random()*seed.length)];
	}
	return result;
}
const objToArray = function(obj){
	const bucket = [];
	Object.keys(obj).forEach(key=>{
		bucket.push(obj[key]);
	})
	return bucket;
}
const OBJevaluate = function(obj){
  const newObj = {};
  for(let i in obj){
    if(obj[i]){
      newObj[i] = obj[i];
    }
  }
  return newObj;
}

const imgErrHandler = function(){
	console.log(this);
}

const is_null = function(arr){
	return arr.length === 0;
}
const openLoading = function(loadingmsg,added,imgSrc){
	return makeElement('div',{
		id:'loadingDiv',
		style:`
			position:absolute;
			top:0;
			left:0;
			width:100%;
			height:100%;
			background:RGB(255,255,255,.7);
			display:flex;
			align-items:center;
			justify-content:center;
			index:1;
		`,
		innerHTML:`
			<div
			style="
				padding:20px;
				display:flex;
				flex-direction:column;
				align-items:center;
				border-radius:20px;
			"
			>
				<img src=${imgSrc||'/file?fn=loadingscreen.gif'}
				style="
					width:200px;
				"
				>
				<span>${loadingmsg}</span>
			</div>
		`,
		onadded(){
			if(added)added(this);
		}
	})
}
const compareSet = function(src,c1,c2){
	if(src===c1){
		src = c2;
	}else if(src===c2){
		src = c1;
	}
}
const forceRecheck = function(el,msg){
	el.saveRemove('#frcel');
	el.addChild(makeElement('div',{
		id:'frcel',
		style:`
			position:absolute;
			background:white;
			padding:10px;
			color:red;
			z-index:1;
			right:0;
			margin:10px;
			font-size:16px;
		`,
		innerHTML:msg,
		onadded(){
			setTimeout(()=>{
				this.remove()
			},2000);
		}
	}))
}
const getTimePlus = function(number){
	return new Date().getTime()+number;
}
const nonull = function(obj){
	const nullkeys = [];
	for(let i in obj){
		if(!obj[i]){
			nullkeys.push(i);
		}
	}
	return {
		valid:nullkeys.length===0?true:false,
		nullkeys
	}
}

const guniqebytime = (timestring)=>{
	const seed = 'AaBbCcDdEeFfJjKkGgHhJjKkLlMmOoPpQqRrSsTtUuVvWwXxYyZz';
	let result = '';
	for(let i of timestring){
		result += seed[Number(i)];
		result += seed[Math.floor(Math.random()*seed.length)];
	}
	return result;
}