

const app = {
	me:{
		name:'gemasajaa'
	},
	main:find('main'),
	content:find('content'),
	header:find('header'),
	nav:find('nav'),
	box:find('#box-div'),
	init(){
		console.log('helloworld, this is gema!');
		
		//firebase init.
		this.initFire();
		
		this.settingNavControll();
		
		this.handlingshrepoint();
	},
	clearBox(){
		this.box.clear();
	},
	settingNavControll(){
		let active;
		this.nav.findall('div').forEach(button=>{
			button.onclick = ()=>{
				if(active === button)return;
				this.clearBox();
				//working gui.
				button.classList.add('activenav');
				if(active){
					active.classList.remove('activenav');
				}
				active = button;
				console.log(button.id);
				if(!this[`new${button.id}`])return;
				this[`new${button.id}`]();
			}
		})
		this.nav.findall('div')[0].click();
	},
	initFire(){
		const firebaseConfig = {
			apiKey: "AIzaSyCFXy-5jmaiwDfuEHYk6zd8b0q2pcOkIw0",
			authDomain: "bringindb.firebaseapp.com",
			databaseURL: "https://bringindb-default-rtdb.asia-southeast1.firebasedatabase.app",
			projectId: "bringindb",
			storageBucket: "bringindb.appspot.com",
			messagingSenderId: "546498762758",
			appId: "1:546498762758:web:fbf3637e5db392bd0f8b87"
		};
		firebase.initializeApp(firebaseConfig);
	},
	newStoriesPanel(){
		this.main.addChild(openLoading('',(loading)=>{
			cOn.get({url:'/loadstories',onload(){
				const data = this.getJSONResponse();
				app.displayData(data);
				loading.remove();
			}})
		},'/file?fn=theloadingscreen.gif'))
	},
	newNewPost(){
		this.box.addChild(view.newNewPost());
	},
	afterPostHandler(data){
		if(data.ok){
			forceRecheck(this.main,'Post Berhasil Disimpan!');
			this.nav.findall('div')[1].click();
		}
	},
	post(data,loading){
		//generate a id for the post.
		const time = new Date().getTime();
		const postId = guniqebytime(String(time));
		data.postId = postId;
		
		firebase.database().ref(`post/${postId}`).update(data).then(()=>{
			loading.remove();
			forceRecheck(this.main,'Berhasil Membuat Laporan!!!');
		})
	},
	displayData(stories){
		const innerBox = makeElement('div',{
			id:'innerBox',
			style:`
				height: 100%;
				display: flex;
				flex-direction: column;
				gap: 10px;
				overflow:auto;
				color:black;
			`,
		});
		let i = 0;
		for(let story in stories){
			innerBox.addChild(view.storylist(stories[story]));
			i += 1;
		}
		if(!i){
			innerBox.innerHTML = `
				<div style="
					width:100%;
					height:100%;
					display:flex;
					align-items:center;
					justify-content:center;
				">
					Belum Ada Pengaduan!
				</div>
			`;
		}
		this.box.addChild(innerBox);
	},
	async handlingshrepoint(){
		let url = location.search;
		if(url.length===0)return;
		
		url = url.slice(1);
		
		url = url.split('=');
		const obj = {};
		for(let i=0;i<url.length;i+=2){
			obj[url[i]] = url[i+1];
		}
		
		if(!obj.postid)return;
		
		let data = await firebase.database().ref(`post/${obj.postid}`).get();
		data = data.val();
		if(!data)return;
		
		await firebase.database().ref(`post/${obj.postid}`).update({share:data.share+1});
		
		this.main.addChild(view.readmore(data));
		window.history.pushState('Home', 'Home', '/');
	},
	newOpenAbout(){
		this.box.addChild(view.aboutorigin());
	}
}
app.init();