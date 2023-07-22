const view = {
  newNewPost(){
    return makeElement('div',{
      style:`
        margin:5%;
        background:white;
        border-radius:20px;
        display: flex;
        width:90%;
        border:2px solid #e9e9e9;
      `,
      innerHTML:`
      <div
      style="
        padding:10px;
        display:flex;
        width:100%;
        flex-direction: column;
      "
      >
        <div
        style="
          font-weight:bold;
          text-align: center;
          width:96%;
					display:flex;
					justify-content:space-between;
					padding:2%;
					align-items:center;
					height:26px;
        "
        >
					<div>BRINGIN NEW PING!</div>
					<div style=display:flex;>
						<span class=button id=publish style="
							display:flex;
							align-items:center;
						">
							<img src=/file?fn=send.png
							style="
								width:16px;
								height:16px;
								margin-right:5px;
							">
							Publish
						</button>
					</div>
				</div>
        <div
        style="
          width:100%;
          margin-top:20px;
        "
        >
          <div style="
            display: flex;
            gap:5px;
						flex-direction:column;
          " id=actionparent>
            <div>
							<div style=margin-bottom:10px;>LENGKAPI DATA BERIKUT!</div>
							<div>Caption</div>
							<div style=display:flex;>
								<input placeholder=Caption... id=caption>
							</div>
						</div>
						<div>
							<div>Lampirkan Foto</div>
							<div style=display:flex;>
								<div style="
									display:flex;
									align-items:center;
									gap:10px;
									background:whitesmoke;
									border-radius:10px;
									cursor:pointer;
									padding:8px;
								" id=mediabutton>
									<img src=/file?fn=gallery.png style="
										width:24px;
										height:24px;
									">
									Pilih Foto
									<span id=medialabel></span>
								</div>
							</div>
						</div>
						<div>
							<div>Lampirkan Alamat*</div>
							<div style=display:flex;>
								<textarea placeholder="Tulis Alamat..." id=location></textarea>
							</div>
						</div>
						<div>
							<div>Share Location</div>
							<div style=display:flex;>
								<div style="
									display:flex;
									align-items:center;
									gap:10px;
									background:whitesmoke;
									border-radius:10px;
									cursor:pointer;
									padding:8px;
								" id=locationbutton>
									<img src=/file?fn=location.png style="
										width:24px;
										height:24px;
									">
									Bagikan Lokasi
								</div>
							</div>
						</div>
          </div>
        </div>
      </div>
      `,
			mediaready:false,
			input:makeElement('input',{type:'file',accept:'image/*',multiple:true}),
			mediasetup(){
				this.find('#mediabutton').onclick = ()=>{
					this.input.click();
				}
				this.input.onchange = ()=>{
					//condition when media is loaded.
					this.mediaready = true;
					//updating label.
					this.find('#medialabel').innerHTML = this.input.files.length+' Dipilih';
					forceRecheck(app.main,'Media Berhasil DiLoad!');
				}
			},
			locationSetup(){
				this.find('#locationbutton').onclick = ()=>{
					if(this.userData.mapPosition)return;
					if(navigator.geolocation){
						forceRecheck(app.main,'Mohon Tunggu, sedang merequest data lokasi!');
						navigator.geolocation.getCurrentPosition((data)=>{
							forceRecheck(app.main,'Lokasi berhasil didapatkan!');
							this.userData.mapPosition = {latitude:data.coords.latitude,longitude:data.coords.longitude};
							this.find('#locationbutton').innerHTML += 'Lokasi Direkam!';
						},()=>{
							forceRecheck(app.main,'Maaf, Data lokasi tidak berhasil didapatkan! Silahkan Coba Lagi!');
						})
					}else forceRecheck(app.main,'Maaf Fitur Tidak Support!');
				}
			},
			upmedia(callback){
				//upload the media.
				let index = 0;
				const src = [];
				const up = ()=>{
					const file = this.input.files[index];
					firebase.storage().ref().child(file.name).put(file,file.type).then((async res=>{
						src.push(await res.ref.getDownloadURL());
						index += 1;
						if(index<this.input.files.length)up();
						else callback(src);
					}))
				}
				up();
			},
      onadded(){
        const publish = this.find('#publish');
				publish.onclick = ()=>{this.publish()};
				this.mediasetup();
				this.locationSetup();
      },
			userData:{caption:null,location:null},
			collectData(){
				//collecting the data of the canvas.
				const input = this.findall('input');
				const textarea = this.findall('textarea');
				input.forEach(input=>{
					if(input.value.length===0){
						input.classList.add('invalid');
					}else {
						this.userData[input.id] = input.value;
						if(input.classList.contains('invalid'))input.classList.remove('invalid');
					}
				})
				//handling for media.
				const mediabutton = this.find('#mediabutton');
				!this.mediaready?mediabutton.classList.add('invalid'):mediabutton.classList.remove('invalid');
				
				textarea.forEach(input=>{
					if(input.value.length===0){
						input.classList.add('invalid');
					}else {
						this.userData[input.id] = input.value;
						if(input.classList.contains('invalid'))input.classList.remove('invalid');
					}
				})
				
				//now getting user info.
				const valid = this.validateUserData();
				if(valid){
					this.startUp();
				}
			},
			validateUserData(){
				let valid = true;
				for(let i in this.userData){
					if(!this.userData[i]){
						valid=false;
						break;
					}
				}
				if(!this.mediaready)valid = false;
				return valid;
			},
			publish(){
				this.collectData();
			},
			startUp(){
				//putloading.
				app.main.addChild(openLoading('',(loading)=>{
					//uploading all of media first.
					this.upmedia((src)=>{
						this.userData.mediaSrc = src;
						
						//now time to update. our db.
						this.post(loading);
					});
				},'/file?fn=theloadingscreen.gif'));
				
			},
			post(loading){
				const d = new Date();
				const date = d.toLocaleDateString();
				const minutes = String(d.getMinutes()).length===1?'0'+d.getMinutes():d.getMinutes();
				const time = `${d.getHours()}:${minutes}`;
				const fulldate = `${date} ${time}`;
				
				this.userData.time = fulldate;
				this.userData.view = 0;
				this.userData.share = 0;
				
				app.post(this.userData,loading);
			}
    })
  },
  newProdutPanel(){
    return makeElement('div',{
      style:`
        margin:5%;
        background:white;
        border-radius:20px;
        display: flex;
        width:90%;
        border:2px solid #e9e9e9;
        position:absolute;
      `,
      innerHTML:`
      <div
      style="
        padding:10px;
        display:flex;
        width:100%;
        flex-direction: column;
        position: relative;
      "
      >
        <div style="position: absolute;cursor: pointer;opacity:.5;" id=closethis>
          <img src="/file?fn=blackclose.png" style="
            width:16px;
            height:16px;
          ">
        </div>
        <div
        style="
          font-weight:bold;
          text-align: center;
          width:100%;
        "
        >Define Your New Transaction!</div>
        <div
        style="
          width:100%;
          margin-top:20px;
        "
        >
          <div>
            <div>Project Name</div>
            <div style="display: flex;">
              <input placeholder="Project Name..." id=name>
            </div>
          </div>
          <div>
            <div>Project Price</div>
            <div style="display: flex;">
              <input placeholder="Project Price..." type="number" id=price>
            </div>
          </div>
          <div>
            <div>Project Password</div>
            <div style="display: flex;">
              <input placeholder="Project Password.." id=password>
            </div>
          </div>
          <div>
            <div>Project Expired</div>
            <div style="display: flex;">
              <input placeholder="Project Password.." type="date" id=expired>
            </div>
          </div>
          <div style="
            display: flex;
            gap:5px;
            margin-top:20px;
            text-align: center;
          ">
            <div id=resetbutton
            style="
              background:#55cc05;
              padding:10px;
              color:white;
              width:100%;
              border-radius: 20px;
              cursor: pointer;
            "
            >Reset</div>
            <div id=savebutton
            style="
              background:#55cc05;
              padding:10px;
              color:white;
              width:100%;
              border-radius: 20px;
              cursor: pointer;
            ">Save</div>
          </div>
        </div>
      </div>
      `,
      data:{},
      onadded(){
        this.find('#closethis').onclick = ()=>{this.remove()};
        this.find('#resetbutton').onclick = ()=>{
          this.findall('input').forEach(input=>{input.value=''});
        }
        this.find('#savebutton').onclick = ()=>{
          let valid = true;
          this.findall('input').forEach(input=>{
            if(input.value.length===0){
              valid = false;
              input.style.borderColor = 'red';
            }else input.style.borderColor = '#e9e9e9';
            this.data[input.id] = input.value;
          })
          if(valid){

          }
          console.log(this.data);
        }
      }
    })
  },
  joinProductPanel(){
    return makeElement('div',{
      style:`
        margin:5%;
        background:white;
        border-radius:20px;
        display: flex;
        width:90%;
        border:2px solid #e9e9e9;
        position:absolute;
      `,
      innerHTML:`
      <div
      style="
        padding:10px;
        display:flex;
        width:100%;
        flex-direction: column;
        position: relative;
      "
      >
        <div style="position: absolute;cursor: pointer;opacity:.5;" id=closethis>
          <img src="/file?fn=blackclose.png" style="
            width:16px;
            height:16px;
          ">
        </div>
        <div
        style="
          font-weight:bold;
          text-align: center;
          width:100%;
        "
        >Join Transaction!</div>
        <div
        style="
          width:100%;
          margin-top:20px;
        "
        >
          <div>
            <div>Project ID</div>
            <div style="display: flex;">
              <input placeholder="Project ID..." id=id>
            </div>
          </div>
          <div>
            <div>Project Password</div>
            <div style="display: flex;">
              <input placeholder="Project Password..." id=password>
            </div>
          </div>
          <div style="
            display: flex;
            gap:5px;
            margin-top:20px;
            text-align: center;
          ">
            <div id=submitbutton
            style="
              background:#55cc05;
              padding:10px;
              color:white;
              width:100%;
              border-radius: 20px;
              cursor: pointer;
            ">Join</div>
          </div>
        </div>
      </div>
      `,
      data:{},
      onadded(){
        this.find('#closethis').onclick = ()=>{this.remove()};
        this.find('#submitbutton').onclick = ()=>{
          let valid = true;
          this.findall('input').forEach(input=>{
            if(input.value.length === 0){
              input.style.borderColor = 'red';
              valid = false;
            }else input.style.borderColor = '#e9e9e9';
            this.data[input.id] = input.value;
          })
          if(valid){
            //when valid, make request.
          }
          console.log(this.data);
        }
      }
    })
  },
  chatBoard(data){
    return makeElement('div',{
      data,
      style:`
        width:99%;
        height:99%;
        background:white;
        border:2px solid #e9e9e9;
        display: flex;
        flex-direction: column;
        position:absolute;
      `,
      innerHTML:`
      <div
      style="
        width:90%;
        height:64px;
        border-bottom:2px solid #e9e9e9;
        display: flex;
        align-items: center;
        padding:2% 5%;
        gap:5px;
        font-weight: bold;
      "
      >
        <div style="
          margin-right:5px;
          display:flex;
          align-items:center;
          cursor:pointer;
          opacity:.5;
        " id=closethis>
          <img src="/file?fn=blackclose.png" style="
            width:16px;
            height:16px;
            border-radius:50%;  
          ">
        </div>
        <div>
          <img src="/file?fn=wa.png" style="
            width:32px;
            height:32px;
            border-radius:50%;  
          ">
        </div>
        <div>
          user-1239128310
        </div>
      </div>
      <div id=msgbox
      style="
        width:100%;
        height:100%;
        background:whitesmoke;
        overflow: auto;
      ">
      </div>
      <div
      style="
        width:96%;
        height:64px;
        border-top:2px solid #e9e9e9;
        display: flex;
        gap:5px;
        padding:2%;
      ">
          <div style="display: flex;width: 100%;">
            <input placeholder="Write Semething...">
          </div>
          <div id=sendmsgbutton style="
            color: white;
            background:#55cc05;
            border-radius:20px;
            width: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor:pointer;
          ">
            Send
          </div>
      </div>
      `,
      putMsg(){
        const d = new Date();
        const date = d.toLocaleDateString();
        const minutes = String(d.getMinutes()).length===1?'0'+d.getMinutes():d.getMinutes();
        const time = `${d.getHours()}:${minutes}`;
        const fulldate = `${date} ${time}`;
        const text = this.find('input').value;
        if(text.length===0)return;
        const updata = {
          date,time,text,from:app.me.name
        }
        msg[this.data.randomRoomId].Messages.push(updata);
        this.find('#msgbox').addChild(view.message(true,`${date} ${time}`,text));
        this.find('input').value = '';
      },
      setupProperty(){
        this.find('#closethis').onclick = ()=>{
          app.clearBox();
          app.newMessagePanel();
          this.remove();
        }
        this.find('#sendmsgbutton').onclick = ()=>{this.putMsg()};
        this.onkeydown = (e)=>{
          if(e.code === 'Enter'){
            this.putMsg();
          }
        }
      },
      onadded(){
        this.setupProperty();
        this.displayMessage();
      },
      displayMessage(){
        const messages = msg[data.randomRoomId].Messages;
        messages.forEach(msg=>{
          this.find('#msgbox').addChild(view.message(msg.from===app.me.name?true:false,`${msg.date} ${msg.time}`,msg.text))
        })
      }
    })
  },
  chatListItems(randomRoomId){
    const Messages = msg[randomRoomId].Messages;
    return makeElement('div',{
      data:{randomRoomId},
      style:`
      width:96%;
      background:white;
      padding:2%;
      border:2px solid #e9e9e9;
      cursor: pointer;
      border-radius:10px;
      `,
      innerHTML:`
      <div>${Messages[Messages.length-1].date} / ${Messages[Messages.length-1].time} ${Messages[Messages.length-1].from}</div>
      <div style="font-weight: bold;font-size:18px;">
        ${Messages[Messages.length-1].text}
      </div>
      `,
      onclick(){
        app.main.addChild(view.chatBoard(this.data));
      }
    })
  },
  message(fromme,fulldate,text){
    return makeElement('div',{
      style:`
      padding: 2% 5%;
      display: flex;
      flex-direction: column;
      align-items: flex-${!fromme?'start':'end'};
      `,
      innerHTML:`
      <div>${fulldate}</div>
      <div style="background:white;padding:10px;border:2px solid #f1f1f1;border-radius: ${!fromme?'0 20px 20px 20px':'20px 0px 20px 20px'};">
        ${text}
      </div>
      `,
      onadded(){
        this.scrollIntoView();
      }
    })
  },
	storylist(data){
		return makeElement('div',{
			data,
			style:`
			background: white;
			padding: 10px;
			border: 2px solid whitesmoke;
			border-radius: 15px;
			display: flex;
			gap: 5px;
			flex-direction: column;
			cursor:pointer;
			`,
			innerHTML:`
				<div style="
					display:flex;
					justify-content:space-between;
				">
					<div>${data.time}</div>
				</div>
				<div id=mediaplace
				style="
					width:100%;
					height:200px;
					background:whitesmoke;
					border-radius:8px;
				"
				>
					<div style="
						width:100%;
						height:100%;
						display:flex;
						align-items:center;
						justify-content:center;
					">
						Loading...
					</div>
				</div>
				<div>
					<div
					style="
						font-size:24px;
					"
					>${data.caption.slice(0,150)}</div>
					<div>${data.location.slice(0,150)}</div>
				</div>
				<div style=display:flex;>
					<div style="display:flex;width:100%;">
						<span class=button style=text-align:center; id=checkbutton>Cek</span>
					</div>
					<div style="
						display:flex;
						width:100%;
						justify-content:flex-end;
						align-items:center;
						gap:10px;
					">
						<div style="
							display:flex;
							gap:5px;
						">
							<div style="
								max-width:50px;
								overflow:hidden;
							">
								${data.view}
							</div>
							<div>
								<img src=/file?fn=view.png
								style="
									width:16px;
									height:16px;
								"
								>
							</div>
						</div>
						<div style="
							display:flex;
							gap:5px;
						">
							<div style="
								max-width:50px;
								overflow:hidden;
							">
								${data.share}
							</div>
							<div>
								<img src=/file?fn=share.png
								style="
									width:16px;
									height:16px;
								"
								>
							</div>
						</div>
					</div>
				</div>
			`,
			giveThumbnail(){
				const onImgLoaded = (img)=>{
					this.find('#mediaplace').clear();
					this.find('#mediaplace').addChild(img);
				}
				const img = makeElement('img',{
					src:this.data.mediaSrc[0],
					style:`
						width:100%;
						height:100%;
						object-fit:cover;
						border-radius:8px;
					`,
					onload(){
						onImgLoaded(this);
					}
				});
			},
			onadded(){
				this.giveThumbnail();
				this.checkButton();
			},
			checkButton(){
				const checkbutton = this.find('#checkbutton');
				checkbutton.onclick = ()=>{
					app.main.addChild(view.readmore(this.data));
				}
			}
		})
	},
	readmore(data){
		return makeElement('div',{
			data,
			style:`
				position:absolute;
				width:100%;
				height:100%;
				top:0;
				left:0;
				display:flex;
				flex-direction:column;
				background:whitesmoke;
			`,
			innerHTML:`
				<div style="
					display:flex;
					justify-content:space-between;
					padding:10px;
					border-bottom:1px solid black;
				">
					<div>
						<div style=cursor:pointer; id=closebutton>
							<img src=/file?fn=blackclose.png style="
								width:16px;
								height:16px;
							">
						</div>
					</div>
					<div>
						<div style=cursor:pointer; id=sharebutton>
							<img src=/file?fn=share.png style="
								width:16px;
								height:16px;
							">
						</div>
					</div>
				</div>
				<div
				style="
					width:96%;
					padding:2%;
					height:32px;
					border-bottom:1px solid black;
					display:flex;
					align-items:center;
					justify-content:flex-start;
					gap:16px;
				">
					<div style="
						display:flex;
						gap:5px;
						cursor:pointer;
					">
						<div>
							<img src=/file?fn=details.png style="
								width:18px;
								height:18px;
							">
						</div>
						Details
					</div>
					<div style="
						display:flex;
						gap:5px;
						cursor:pointer;
					" id=opencomment>
						<div>
							<img src=/file?fn=chat.png style="
								width:18px;
								height:18px;
							">
						</div>
						Comment
					</div>
				</div>
				<div id=imglayer
				style="
					width: 96%;
					padding: 2%;
					height: 200px;
					background: white;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					gap: 10px;
					overflow: auto;
				"
				>
					<div style="
						width:100%;
						height:100%;
						display:flex;
						align-items:center;
						justify-content:center;
					">
						Loading...
					</div>
				</div>
				<div
				style="
					width:96%;
					padding:2%;
					height:50%;
					font-size:18px;
					overflow:auto;
					display:flex;
					flex-direction:column;
					justify-content:flex-start;
					gap:10px;
				">
					<div style="font-weight:bold">
							Details
					</div>
					<div>
						<div style="font-weight:bold">
							Waktu
						</div>
						<div>
							${data.time}
						</div>
					</div>
					<div>
						<div style="font-weight:bold">
							Caption
						</div>
						<div>
							${data.caption}
						</div>
					</div>
					<div>
						<div style="font-weight:bold">
							Lokasi
						</div>
						<div>
							${data.location}
						</div>
					</div>
					<div ${!data.mapPosition?'hidden':''} style="
						position:sticky;
						bottom:0;
						background:whitesmoke;
					">
						<div style="font-weight:bold">
							Buka Di MAPS
						</div>
						<div style="
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 10px;
							width: 100%;
							height: 48px;
							background: orange;
							color: white;
							border-radius: 8px;
							margin-top: 10px;
							cursor: pointer;
						" id=openlocation>
							<div>
								<img src=/file?fn=gmaps.png style="
									width:24px;
									height:24px;
								"
							</div>
							Buka Lokasi
						</div>
					</div>
				</div>
			`,
			opencommentsetup(){
				this.find('#opencomment').onclick = ()=>{
					app.main.addChild(view.comment(this.data));
				}
			},
			
			processMedia(){
				const imgs = [];
				let i = 0;
				const allloaded = ()=>{
					const imglayer = this.find('#imglayer');
					//cleaning
					imglayer.clear();
					imgs.forEach(img=>{
						imglayer.addChild(img);
					})
				}
				this.data.mediaSrc.forEach(link=>{
					imgs.push(makeElement('img',{
						data:this.data,
						style:`
							width:100%;
							height:100%;
							object-fit:cover;
							border-radius:8px;
							pointer-events: inherit;
							cursor:pointer;
						`,
						onclick(){
							find('body').addChild(makeElement('img',{
								src:link,
								style:`
									position:absolute;
									width:100%;
									height:100%:
									object-fit:cover;
									pointer-events: inherit;
									cursor:pointer;
								`,
								onclick(){
									this.remove();
								}
							}))
						},
						src:link,
						onload(){
							i += 1;
							if(i===this.data.mediaSrc.length)allloaded();
						}
					}))
				})
			},
			setupClose(){
				this.find('#closebutton').onclick = ()=>{this.remove()};
			},
			setupShare(){
				this.find('#sharebutton').onclick = ()=>{
					app.main.addChild(view.sharePanel(this.data));
				};
			},
			async onadded(){
				await this.updateView();
				this.setupClose();
				this.setupShare();
				this.opencommentsetup();
				this.processMedia();
				this.openonmapssetup();
			},
			openonmapssetup(){
				if(!this.data.mapPosition)return;
				const pos = `${this.data.mapPosition.latitude},${this.data.mapPosition.longitude}`;
				this.find('#openlocation').onclick = ()=>{
					window.open(`https://www.google.com/maps/place/${pos}`,'blank');
				}
			},
			updateView(){
				return firebase.database().ref(`post/${this.data.postId}`).update({view:this.data.view+1});
			}
		})
	},
	comment(data){
		return makeElement('div',{
			data,
			style:`
				position:absolute;
				width:100%;
				height:100%;
				top:0;
				left:0;
				display:flex;
				flex-direction:column;
				background:whitesmoke;
			`,
			innerHTML:`
				<div style="
					display:flex;
					justify-content:space-between;
					padding:10px;
					border-bottom:1px solid black;
				">
					<div>
						<div style=cursor:pointer; id=closebutton>
							<img src=/file?fn=blackclose.png style="
								width:16px;
								height:16px;
							">
						</div>
					</div>
					<div>
						<div style=cursor:pointer; id=sharebutton>
							Ayo Comment!
						</div>
					</div>
				</div>
				<div style="
					padding:2%;
					width:96%;
					height:100%;
					overflow:auto;
				" id=msgbox>
				</div>
				<div style="
					height:64px;
					width:96%;
					display:flex;
					align-items:center;
					justify-content:space-between;
					padding:2%;
					gap:5px;
					border-top:1px solid black;
				">
					<div style=display:flex;cursor:pointer;>
						<img src=/file?fn=settings.png style="
							width:24px;
							height:24px;
						">
					</div>
					<div style=display:flex;width:100%;>
						<input placeholder="Tulis Sesuatu...">
					</div>
					<div>
						<span class=button style=padding:10px; id=sendbutton>Send</span>
					</div>
				</div>
			`,
			inputsetup(){
				const input = this.find('input');
				input.onkeydown = (e)=>{
					if(e.code==='Enter' && input.value.length>0){
						this.processMsg(input.value);
						input.value = '';
					}
				}
				this.find('#sendbutton').onclick = ()=>{
					if(input.value.length>0){
						this.processMsg(input.value);
						input.value = '';
					}
				}
			},
			streamEvent(){
				firebase.database().ref(`chat/${this.data.postId}`).on('value', (snapshot)=>{
						const data = snapshot.val();
						this.displayMsg(data[data.length-1]);
				});
			},
			closebuttonsetup(){
				this.find('#closebutton').onclick = ()=>{
					this.remove();
				}
			},
			async loadoldmsg(){
				let msgs = await firebase.database().ref(`chat/${this.data.postId}`).get();
				msgs = msgs.val();
				
				msgs.forEach(msg=>{
					this.displayMsg(msg);
				})
			},
			onadded(){
				this.loadoldmsg();
				this.closebuttonsetup();
				this.inputsetup();
				this.streamEvent();
			},
			async processMsg(msg){
				const d = new Date();
				const date = d.toLocaleDateString();
				const minutes = String(d.getMinutes()).length===1?'0'+d.getMinutes():d.getMinutes();
				const time = `${d.getHours()}:${minutes}`;
				const fulldate = `${date} ${time}`;
				
				let msgs = await firebase.database().ref(`chat/${this.data.postId}`).get();
				msgs = msgs.val();
				if(!msgs)msgs = [{from:'someone',msg,time:fulldate}];
				else msgs.push({from:'someone',msg,time:fulldate});
				
				this.lastTimeMsg = fulldate;
				await firebase.database().ref(`chat/${this.data.postId}`).set(msgs);
				
				
				//this.displayMsg({from:'someone',msg,time:fulldate});
			},
			displayMsg(data){
				this.find('#msgbox').addChild(makeElement('div',{
					style:`
						margin-top:5px;
					`,
					innerHTML:`
						<div>${data.time}-${data.from}</div>
						<div style="
							display:flex;
							justify-content:flex-start;
						">
							<div
							style="
								background:white;
								border-radius:0 20px 20px 20px;
								padding:10px;
							"
							>
							${data.msg}
							</div>
						</div>
					`,
					onadded(){
						this.scrollIntoView();
					}
				}))
			}
		})
	},
	sharePanel(data){
		return makeElement('div',{
			style:`
				display:flex;
				align-items:center;
				justify-content:center;
				height:100%;
				width:100%;
				background:rgb(0,0,0,.5);
				position:absolute;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					background:white;
					border-radius:8px;
				">
					<div style="text-align:center;">Salin Link Dibawah Ini!</div>
					<div style=width:200px;display:flex;margin-top:10px;>
						<input value=${location.origin}/?postid=${data.postId}>
					</div>
					<div style="margin-top:10px;">
						<div style="
							padding:10px;
							color:white;
							background:orange;
							text-align:center;
							border-radius:8px;
							cursor:pointer;
						" id=closebutton>
							Selesai
						</div>
					</div>
				</div>
			`,
			closeSetup(){
				this.find('#closebutton').onclick = ()=>{this.remove()};
			},
			onadded(){
				this.closeSetup();
			}
		})
	},
	aboutorigin(){
		return makeElement('div',{
			style:`
				width:100%;
				height:100%;
				display:flex;
				align-items:flex-start;
				justify-content:center;
				
			`,
			innerHTML:`
				<div id=innerBox style="
					padding:10px;
					background:white;
					border-radius:8px;
					border: 2px solid rgb(233, 233, 233);
					display:flex;
					flex-direction:column;
					gap:10px;
				">
					<div style="
						width:100%;
						height:100%;
					">
						<div>
							BRINGIN FILOSOFI
						</div>
						<div>
							Kebersihan adalah tanggung jawab bersama, dan aplikasi kami hadir untuk membangun kesadaran dan aksi nyata dalam menjaga lingkungan. Dengan setiap aduan yang dilaporkan, kita memberikan suara pada tempat-tempat yang terindikasi banyak sampah, menjadikan kita sebagai agen perubahan untuk menciptakan lingkungan yang lebih bersih dan sehat. Bersama-sama, kita dapat mengubah dunia dengan satu aduan pada satu waktu.
						</div>
					</div>
					<div style="
						width:100%;
						height:100%;
					">
						<div>
							WHY BRINGIN?
						</div>
						<div>
							 Fokus yang lebih spesifik: Aplikasi saya didesain khusus untuk pengaduan tempat-tempat yang terindikasi banyak sampah. Dengan fokus yang lebih spesifik ini, pengguna dapat dengan mudah dan cepat melaporkan lokasi-lokasi yang membutuhkan perhatian terhadap kebersihan. Sementara itu, di platform media sosial besar, pengguna harus mencari grup atau akun yang relevan, yang membutuhkan waktu dan upaya ekstra
						</div>
					</div>
					<div style="
						width:100%;
						height:100%;
					">
						<div>
							PENGEMBANG
						</div>
						<div>
							Rahmat Agem Pratama<br>G1D023031
						</div>
					</div>
					<div style="
						width:100%;
						height:100%;
					">
						<div>
							PORTOFOLIO
						</div>
						<div>
							<a href=https://infinitydreams.cyclic.app>https://infinitydreams.cyclic.app</a>
						</div>
					</div>
				</div>
			`,
			
		})
	}
}