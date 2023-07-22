

const admin = {
  template:{
    setting(data){
      return makeElement('div',{
        style:`
        padding:20px;
        display: flex;
        font-size:18px;
        flex-direction: column;
        gap: 2px;
        `,
        innerHTML:`
        <div><b>Provider</b></div>
        <div>
          <div>Digiflazz Api Username</div>
          <div>
            <input placeholder="Tambahkan Username" readonly>
          </div>
        </div>
        <div>
          <div>Digiflazz Api Secret Key</div>
          <div>
            <input placeholder="Tambahkan Key Secret" readonly>
          </div>
        </div>
        <div><b>Payment GateWay</b></div>
        <div>
          <div>Ipaymu Api Username</div>
          <div>
            <input placeholder="Tambahkan Username" readonly>
          </div>
        </div>
        <div>
          <div>Ipaymu Api Secret Key</div>
          <div>
            <input placeholder="Tambahkan Key Secret" readonly>
          </div>
        </div>
        <div><b>User Interaction</b></div>
        <div>
          <div>Markup Harga / Global</div>
          <div>
            <input placeholder="Tambahkan Harga" type=number value=${data.itemmarkupprice} id=itemmarkupprice>
          </div>
        </div>
        <div>
          <div>Bonus Deposit</div>
          <div>
            <input placeholder="Tambahkan Bonus" type=number value=${data.depositbonus} id=depositbonus>
          </div>
        </div>
        `,
        userData:{
        },
        addinputEvent(){
          this.findall('input').forEach(input=>{
            input.onchange = ()=>{
              this.userData[input.id] = Number(input.value);
            }
          })
        },
        submitEvent(){
          admin.content.find('#savechanges').onclick = ()=>{
            cOn.post({
              url:'/admin',
              someSettings:[
                ['setRequestHeader','content-type','application/json']
              ],
              data:jsonstr({type:'updatetweaks',data:this.userData}),
              onload(){
                const data = this.getJSONResponse();
                if(data.valid){
                  forceRecheck(admin.main,'Update Sukses!');
                  admin.adminbody.clear();
                  admin.opensetting();
                }
              }
            });
          }
        },
        onadded(){
          this.addinputEvent();
          this.submitEvent();
        }
      })
    },
    users(data){
      return makeElement('div',{
        data,
        style:`
          display: flex;
          font-size:18px;
          align-items: flex-start;
          flex-direction: column;
        `,
        innerHTML:`
        <div style="
        border-bottom:2px solid #f1f1f1;
        height:48px;
        display: flex;
        align-items: center;
        position:sticky;
        top:0;
        background:white;
      ">
        <div
        style="
          width: 64px;
          overflow: auto;
          text-align: center;
        "
        >No</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Nama</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Email</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Phone</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Saldo</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">G Points</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Voucher</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Transaksi</div>
      </div>
      <div
      style="
        display: flex;
        font-size:18px;
        align-items: center;
        flex-direction: column;
        height:100%;
      "
      >
        <div style="
          height:90%;
          width: 100%;
          display: flex;
          justify-content: space-around;
          overflow: auto;
        ">
          <div id=userparent
            style="width:100%"
          >
          </div>
        </div>
      </div>
        `,
        processUsers(){
          const userTemplate = (i,data)=>{
            return makeElement('div',{
              style:`
              margin-top:10px;
              width: 100%;
              display: flex;
              overflow: auto;
              font-size:14px;
              `,
              innerHTML:`
              <div
              style="
                width: 64px;
                overflow: auto;
                text-align: center;
              "
              >
                ${i}.
              </div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.name}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.email}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.hp}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">Rp. ${getPrice(data.ballance)}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${getPrice(data.points)} G</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${getPrice(objlen(data.vouchers))}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${getPrice(!data.Trxs?0:data.Trxs.length)}</div>
              `
            })
          }
          let index = 0;
          for(let i in this.data){
            index++;
            this.find('#userparent').addChild(userTemplate(index,this.data[i]));
          }
        },
        onadded(){
          this.processUsers();
        }
      })
    },
    history(data){
      return makeElement('div',{
        data,
        style:`
          display: flex;
          font-size:18px;
          align-items: flex-start;
          flex-direction: column;
        `,
        innerHTML:`
        <div style="
        border-bottom:2px solid #f1f1f1;
        height:48px;
        display: flex;
        align-items: center;
        position:sticky;
        top:0;
        background:white;
      ">
        <div
        style="
          width: 64px;
          overflow: auto;
          text-align: center;
        "
        >No</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Id Transaksi</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Email</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Phone</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Hp</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Game Id</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Server Id</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Ammount</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Payment</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">PaymentCode</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Expired</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Status</div>
      </div>
      <div
      style="
        display: flex;
        font-size:14px;
        align-items: flex-start;
        flex-direction: column;
        height:100%;
        width: 100%;
      "
      >
        <div style="
          display: flex;
          justify-content: space-around;
          overflow: auto;
        ">
          <div id=userparent
            style="width:100%"
          >
          </div>
        </div>
      </div>
        `,
        processUsers(){
          const userTemplate = (trxid,i,data)=>{
            return makeElement('div',{
              style:`
              margin-top:10px;
              width: 100%;
              display: flex;
              overflow: auto;
              `,
              innerHTML:`
              <div
              style="
                width: 64px;
                overflow: auto;
                text-align: center;
              "
              >
                ${i}.
              </div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${trxid}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.moredetails.validationData.email}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.moredetails.validationData.phone}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.moredetails.targetData.hp||'-'}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.moredetails.targetData.gameid||'-'}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.moredetails.targetData.serverid||'-'}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">Rp. ${getPrice(data.moredetails.products.ammount)}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.payment}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.paymentCode||'-'}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.expired||'-'}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.status}</div>
              `
            })
          }
          let index = 0;
          for(let i in this.data){
            index++;
            this.find('#userparent').addChild(userTemplate(i,index,this.data[i]));
          }
        },
        onadded(){
          this.processUsers();
        }
      })
    },
    vouchers(data){
      return makeElement('div',{
        data,
        style:`
          display: flex;
          font-size:18px;
          align-items: flex-start;
          flex-direction: column;
        `,
        innerHTML:`
        <div style="
        height:48px;
        display: flex;
        align-items: center;
        position:sticky;
        top:0;
        background:white;
        border-bottom:2px solid #f1f1f1;
      ">
        <div
        style="
          width: 64px;
          overflow: auto;
          text-align: center;
        "
        >No</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Voucher Id</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Nominal Diskon (%)</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Kategori Produk</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Jenis Produk</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Expired</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Harga</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Hapus</div>
      </div>
      <div
      style="
        display: flex;
        font-size:14px;
        align-items: flex-start;
        flex-direction: column;
        height:100%;
        width: 100%;
      "
      >
        <div style="
          display: flex;
          justify-content: space-around;
          overflow: auto;
        ">
          <div id=userparent
            style="width:100%"
          >
          </div>
        </div>
      </div>
        `,
        processUsers(){
          const userTemplate = (trxid,i,data)=>{
            return makeElement('div',{
              style:`
              margin-top:10px;
              width: 100%;
              display: flex;
              overflow: auto;
              align-items:center;
              `,
              innerHTML:`
              <div
              style="
                width: 64px;
                overflow: auto;
                text-align: center;
              "
              >
                ${i}.
              </div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
                display:flex;
              "><input value=${trxid} style="width:100%"></div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${Number(data.pricecutter)}%</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.category}</div><div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.type}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.expired}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${getPrice(data.gpointneeded||0)} GPoints</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">
                <img src=/file?fn=delete.png
                style="
                  width:18px;
                  height:18px;
                  cursor:pointer;
                "
                >
              </div>
              `,trxid,
              deleteButtonSetup(){
                this.find('img').onclick = ()=>{
                  const onload = (data)=>{
                    if(data.valid){
                      admin.content.find('#refreshbutton').click();
                    }else forceRecheck(admin.main,'Gagal Menghapus Voucher!');
                  }
                  cOn.post({
                    url:'/admin',
                    someSettings:[
                      ['setRequestHeader','content-type','application/json']
                    ],
                    data:jsonstr({type:'deletevoucher',voucherid:this.trxid}),
                    onload(){
                      onload(this.getJSONResponse());
                    }
                  })
                }
              },
              onadded(){
                this.deleteButtonSetup();
              }
            })
          }
          let index = 0;
          for(let i in this.data){
            index++;
            this.find('#userparent').addChild(userTemplate(i,index,this.data[i]));
          }
          if(index ===0 ){
            this.find('#userparent').parentElement.parentElement.appendChild(makeElement('div',{
              style:`
                width:100%;
                height:100%;
                align-items:center;
                justify-content:center;
              `,
              innerHTML:'Tidak Ada Data!'
            }))
          }
        },
        onadded(){
          this.processUsers();
        }
      })
    },
    newVoucher(){
      return makeElement('div',{
        style:`
          position: absolute;
          /* width: 100%; */
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
        `,
        innerHTML:`
          <div
          style="
            background: white;
            font-size: 18px;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: auto;
          "
          >
            <div
            style="
              display: flex;
              align-items: center;
              justify-content: flex-start;
              gap: 10px;
              padding: 20px 0;
              border-bottom: 2px solid #f1f1f1;
            "
            >
              <div
              style="
                width:100px;
                text-align:center;
              "
              >No</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">VoucherId</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Diskon(%)</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Kategory</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Jenis</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Expired</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Harga/GPoints</div>
            </div>
            <div id=body
            style="
              min-height:200px;
              max-height:500px;
              overflow:auto;
            "
            >
            </div>
            <div
            style="
              display: flex;
              align-items: center;
              /* padding: 10px 5px; */
              gap: 10px;
              justify-content: flex-end;
              /* border-top: 2px solid #f1f1f1; */
              position: fixed;
              right: 0;
              bottom: 20px;
              background: white;
              margin-right:10px;
            "
            >
              <div id=newrowbutton
              style="
                background:orange;
                padding:10px;
                color:white;
                border-radius:20px;
                cursor:pointer;
              "
              >
                <div>Tambah</div>
              </div>
              <div id=savebutton
              style="
                background:orange;
                padding:10px;
                color:white;
                border-radius:20px;
                cursor:pointer;
              ">
                <div>Simpan</div>
            </div>
            <div id=closebutton
              style="
                background:orange;
                padding:10px;
                color:white;
                border-radius:20px;
                cursor:pointer;
              ">
                <div>Batal</div>
              </div>
          </div>
        `,
        vouchers:{},
        addRow(voucher,id){
          this.find('#body').addChild(makeElement('div',{
            id,
            style:`
              display:flex;
              align-items:center;
              width:100%;
              justify-content:flex-start;
              margin-top:10px;
              gap:10px;
              padding-bottom:10px;
              border-bottom:1px solid #f1f1f1;
            `,
            parent:this,
            innerHTML:`
              <div
              style="
                width:100px;
                text-align:center;
              "
              >${objlen(this.vouchers)}.</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">${voucher.id}</div>
              <div
              style="
                width:200px;
                text-align:center;
              "><input placeholder="Nominal Diskon" type=number id=pricecutter></div>
              <div
              style="
                width:200px;
                text-align:center;
              ">
                <select id=category>
                  <option>Pilih Kategory</option>
                </select>
              </div>
              <div
              style="
                width:200px;
                text-align:center;
              ">
                <select id=type>
                  <option>Pilih Jenis</option>
              </select>
              </div>
              <div
              style="
                width:200px;
                text-align:center;
              "><input type=date id=expired></div>
              <div
              style="
                width:200px;
                text-align:center;
              "><input type=number id=gpointneeded placeholder="Gpoint yang dibutuhkan"></div>
            `,
            processDb(){
              // this.basedata.forEach(data=>{
              // 	if(this.db[data.category_name]){
              // 		if(this.db[data.category_name][data.operator_produk]){
              // 			this.db[data.category_name][data.operator_produk].push(data);
              // 		}else{
              // 			this.db[data.category_name][data.operator_produk] = [data];
              // 		}
              // 	}else{
              // 		const obj = {};
              // 		obj[data.operator_produk] = [data];
              // 		this.db[data.category_name] = data;
              // 	}
              // })
              this.basedata.forEach(item=>{
                if(this.db[item.category]){
                  if(this.db[item.category][item.brand]){
                    this.db[item.category][item.brand].push(item);
                  }else{
                    this.db[item.category][item.brand] = [item];
                  }
                }else{
                  const obj = {};
                  obj[item.brand] = [item];
                  this.db[item.category] = obj;
                }
              })
            },
            db:{},
            initData(){
              const onload = (data)=>{
                this.basedata = data.base.data;
                this.processDb();
                this.selectEvent();
              }
              cOn.get({
                url:'/info?type=all',
                onload(){
                  onload(this.getJSONResponse());
                }
              })
            },
            selectEvents:{
              category(select,db){
                for(let i in db){
                  select.addChild(makeElement('option',{
                    innerHTML:i
                  }))
                }
              },
              type(select,db,category){
                for(let i in db[category]){
                  select.addChild(makeElement('option',{
                    innerHTML:i
                  }))
                }
              }
            },
            selectEvent(){
              this.findall('select').forEach(select=>{
                select.onchange = ()=>{
                  this.parent.vouchers[this.id][select.id] = select.value;
                  this.category = select.value;
                }
                select.onclick = ()=>{
                  this.selectEvents[select.id](select,this.db,this.category);
                }
              })
              this.findall('input').forEach(input=>{
                input.onchange = ()=>{
                  this.parent.vouchers[this.id][input.id] = input.value;
                }
              })
            },
            onadded(){
              this.initData();
            }
          }))
        },
        setupEventButton(){
          this.find('#newrowbutton').onclick = ()=>{
            const voucher = {
              id:`GMV${getTimePlus(Math.floor(Math.random()*10000))}`,
              pricecutter:null,
              expired:null,
              category:'game',
              type:'mobilelegend'
            }
            this.vouchers[voucher.id] = voucher;
            this.addRow(voucher,voucher.id);
          }
          this.find('#savebutton').onclick = ()=>{
            const onload = (res)=>{
              if(res.valid){
                admin.content.find('#refreshbutton').click();
                this.remove();
              }
            }
            cOn.post({
              url:'/admin',
              someSettings:[
                ['setRequestHeader','content-type','application/json']
              ],
              data:jsonstr({type:'updatevoucher',vouchers:this.vouchers}),
              onload(){
                onload(this.getJSONResponse())
              }
            })
          }
          this.find('#closebutton').onclick = ()=>{
            admin[admin.state]();
            this.remove();
          }
        },
        onadded(){
          this.setupEventButton();
          this.find('#newrowbutton').click();
        }
      })
    },
    newMarkup(){
      return makeElement('div',{
        style:`
          position: absolute;
          /* width: 100%; */
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          width:100%;
        `,
        innerHTML:`
          <div
          style="
            background: white;
            font-size: 18px;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: auto;
          "
          >
            <div
            style="
              display: flex;
              align-items: center;
              justify-content: flex-start;
              gap: 10px;
              padding: 20px 0;
              border-bottom: 2px solid #f1f1f1;
              width:100%;
            "
            >
              <div
              style="
                width:100px;
                text-align:center;
              "
              >No</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Kategory</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Jenis</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Produk</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">Harga</div>
            </div>
            <div id=body
            style="
              min-height:200px;
              max-height:500px;
              overflow:auto;
            "
            >
            </div>
            <div
            style="
              display: flex;
              align-items: center;
              /* padding: 10px 5px; */
              gap: 10px;
              justify-content: flex-end;
              /* border-top: 2px solid #f1f1f1; */
              position: fixed;
              right: 0;
              bottom: 20px;
              background: white;
              margin-right:10px;
            "
            >
              <div id=newrowbutton
              style="
                background:orange;
                padding:10px;
                color:white;
                border-radius:20px;
                cursor:pointer;
              "
              >
                <div>Tambah</div>
              </div>
              <div id=savebutton
              style="
                background:orange;
                padding:10px;
                color:white;
                border-radius:20px;
                cursor:pointer;
              ">
                <div>Simpan</div>
            </div>
            <div id=closebutton
              style="
                background:orange;
                padding:10px;
                color:white;
                border-radius:20px;
                cursor:pointer;
              ">
                <div>Batal</div>
              </div>
          </div>
        `,
        vouchers:{},
        addRow(voucher,id){
          this.find('#body').addChild(makeElement('div',{
            id,
            style:`
              display:flex;
              align-items:center;
              width:100%;
              justify-content:flex-start;
              margin-top:10px;
              gap:10px;
              padding-bottom:10px;
              border-bottom:1px solid #f1f1f1;
            `,
            parent:this,
            innerHTML:`
              <div
              style="
                width:100px;
                text-align:center;
              "
              >${objlen(this.vouchers)}.</div>
              <div
              style="
                width:200px;
                text-align:center;
              ">
                <select id=category>
                  <option>Pilih Kategory</option>
                </select>
              </div>
              <div
              style="
                width:200px;
                text-align:center;
              ">
                <select id=type>
                  <option>Pilih Jenis</option>
                </select>
              </div>
              <div
              style="
                width:200px;
                text-align:center;
              ">
                <select id=products>
                  <option>Pilih Produk</option>
                </select>
              </div>
              <div
              style="
                width:200px;
                text-align:center;
              "><input type=number id=markupPrice placeholder="Set Harga Markup"></div>
            `,
            processDb(){
              // this.basedata.forEach(data=>{
              // 	if(this.db[data.category_name]){
              // 		if(this.db[data.category_name][data.operator_produk]){
              // 			this.db[data.category_name][data.operator_produk].push(data);
              // 		}else{
              // 			this.db[data.category_name][data.operator_produk] = [data];
              // 		}
              // 	}else{
              // 		const obj = {};
              // 		obj[data.operator_produk] = [data];
              // 		this.db[data.category_name] = data;
              // 	}
              // })
              this.basedata.forEach(item=>{
                console.log(item);
                if(this.db[item.category]){
                  if(this.db[item.category][item.brand]){
                    this.db[item.category][item.brand].push(item);
                  }else{
                    this.db[item.category][item.brand] = [item];
                  }
                }else{
                  const obj = {};
                  obj[item.brand] = [item];
                  this.db[item.category] = obj;
                }
              })
            },
            db:{},
            initData(){
              const onload = (data)=>{
                this.basedata = data.base.data;
                this.processDb();
                this.selectEvent();
              }
              cOn.get({
                url:'/info?type=all',
                onload(){
                  onload(this.getJSONResponse());
                }
              })
            },
            selectEvents:{
              category(select,db){
                for(let i in db){
                  select.addChild(makeElement('option',{
                    innerHTML:i
                  }))
                }
              },
              type(select,db,category){
                for(let i in db[category]){
                  select.addChild(makeElement('option',{
                    innerHTML:i
                  }))
                }
              },
              products(select,db,category,type){
                for(let i of db[category][type]){
                  console.log(i);
                  select.addChild(makeElement('option',{
                    innerHTML:i.product_name
                  }))
                }
              }
            },
            selectEvent(){
              const selectedSelect = {};
              this.findall('select').forEach(select=>{
                select.onchange = ()=>{
                  this.parent.vouchers[this.id][select.id] = select.value;
                  this[select.id] = select.value;
                }
                select.onclick = ()=>{
                  if(select.id==='type' && !selectedSelect['category'])return;
                  if(selectedSelect[select.id])return;
                  this.selectEvents[select.id](select,this.db,this.category,this.type);
                  selectedSelect[select.id] = true;
                }
              })
              this.findall('input').forEach(input=>{
                input.onchange = ()=>{
                  this.parent.vouchers[this.id][input.id] = input.value;
                }
              })
            },
            onadded(){
              this.initData();
            }
          }))
        },
        setupEventButton(){
          this.find('#newrowbutton').onclick = ()=>{
            const voucher = {
              id:`GMMP${getTimePlus(Math.floor(Math.random()*10000))}`,
              markupPrice:null,
              category:'game',
              type:'mobilelegend'
            }
            this.vouchers[voucher.id] = voucher;
            this.addRow(voucher,voucher.id);
          }
          this.find('#savebutton').onclick = ()=>{
            const onload = (res)=>{
              if(res.valid){
                admin.content.find('#refreshbutton').click();
                this.remove();
              }
            }
            cOn.post({
              url:'/admin',
              someSettings:[
                ['setRequestHeader','content-type','application/json']
              ],
              data:jsonstr({type:'updateMarkupPrice',vouchers:this.vouchers}),
              onload(){
                onload(this.getJSONResponse())
              }
            })
          }
          this.find('#closebutton').onclick = ()=>{
            admin[admin.state]();
            this.remove();
          }
        },
        onadded(){
          this.setupEventButton();
          this.find('#newrowbutton').click();
        }
      })
    },
    setPrice(data){
      return makeElement('div',{
        data,
        style:`
          display: flex;
          font-size:18px;
          align-items: flex-start;
          flex-direction: column;
        `,
        innerHTML:`
        <div style="
        height:48px;
        display: flex;
        align-items: center;
        position:sticky;
        top:0;
        background:white;
        border-bottom:2px solid #f1f1f1;
        width:100%;
      ">
        <div
        style="
          width: 64px;
          overflow: auto;
          text-align: center;
        "
        >No</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Kategori Produk</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Jenis Produk</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Produk</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Markup Harga</div>
        <div
        style="
          width: 200px;
          overflow: auto;
          text-align: center;
        ">Hapus</div>
      </div>
      <div
      style="
        display: flex;
        font-size:14px;
        align-items: flex-start;
        flex-direction: column;
        height:100%;
        width: 100%;
      "
      >
        <div style="
          display: flex;
          justify-content: space-around;
          overflow: auto;
        ">
          <div id=userparent
            style="width:100%"
          >
          </div>
        </div>
      </div>
        `,
        processUsers(){
          const userTemplate = (trxid,i,data)=>{
            return makeElement('div',{
              style:`
              margin-top:10px;
              width: 100%;
              display: flex;
              overflow: auto;
              `,
              innerHTML:`
              <div
              style="
                width: 64px;
                overflow: auto;
                text-align: center;
              "
              >
                ${i}.
              </div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.category}</div><div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.type}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">${data.products}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">Rp. ${getPrice(data.markupPrice||0)}</div>
              <div
              style="
                width: 200px;
                overflow: auto;
                text-align: center;
              ">
                <img src=/file?fn=delete.png
                style="
                  width:18px;
                  height:18px;
                  cursor:pointer;
                "
                >
              </div>
              `,trxid,
              deleteButtonSetup(){
                this.find('img').onclick = ()=>{
                  const onload = (data)=>{
                    if(data.valid){
                      admin.content.find('#refreshbutton').click();
                    }else forceRecheck(admin.main,'Gagal Menghapus Voucher!');
                  }
                  cOn.post({
                    url:'/admin',
                    someSettings:[
                      ['setRequestHeader','content-type','application/json']
                    ],
                    data:jsonstr({type:'deleteMarkupPrice',voucherid:this.trxid}),
                    onload(){
                      onload(this.getJSONResponse());
                    }
                  })
                }
              },
              onadded(){
                this.deleteButtonSetup();
              }
            })
          }
          let index = 0;
          for(let i in this.data){
            index++;
            this.find('#userparent').addChild(userTemplate(i,index,this.data[i]));
          }
          if(index ===0 ){
            this.find('#userparent').parentElement.parentElement.appendChild(makeElement('div',{
              style:`
                width:100%;
                height:100%;
                align-items:center;
                justify-content:center;
              `,
              innerHTML:'Tidak Ada Data!'
            }))
          }
        },
        onadded(){
          this.processUsers();
        }
      })
    },
    addUserSaldo(){
      return makeElement('div',{
        style:`
          position: absolute;
          /* width: 100%; */
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          width:100%;
        `,
        innerHTML:`
          <div
          style="
            background: white;
            font-size: 18px;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: auto;
          "
          >
            <div style="
              padding: 10px;
              display: flex;
              gap: 10px;
              align-items: center;
              border: 1px solid #f1f1f1;
              border-top: 0;
              border-left: 0;
              justify-content: center;
            ">
              <div>
                <div>User Email</div>
                <div>
                  <input placeholder="Masukan User Email" id=email>
                </div>
              </div>
              <div>
                <div>Saldo To Add</div>
                <div>
                  <input placeholder="Masukan Jumlah Saldo" id=saldo type=number>
                </div>
              </div>
              <div style="
                margin-left:20px;
              ">
                <div id=submitbutton
                style="
                  padding:10px;
                  background:#111340;
                  color:white;
                  border-radius:20px;
                  cursor:pointer;
                "
                >Topup</div>
              </div>
            </div>
          </div>
        `,
        userData:{
          email:null,
          saldo:null
        },
        setupInput(){
          this.findall('input').forEach(input=>{
            input.onchange = ()=>{
              this.userData[input.id] = input.value;
            }
          })
        },
        submitButtonSetup(){
          this.find('#submitbutton').onclick = ()=>{
            const result = nonull(this.userData);
            if(!result.valid)return forceRecheck(admin.content,'Tolong isi semua data!');
            cOn.post({
              url:'/admin',
              someSettings:[
                ['setRequestHeader','content-type','application/json']
              ],
              data:jsonstr({type:'admindeposit',userData:this.userData}),
              onload(){
                forceRecheck(admin.content,this.getJSONResponse().msg);
              }
            })
          }
        },
        onadded(){
          this.setupInput();
          this.submitButtonSetup();
        }
      })
    } 
  },
  state:'opensetting',
  main:find('main'),
  content:find('content'),
  adminbody:find('#body'),
  opensetting(){
    //req a setting first.
    const response = (data)=>{
      this.adminbody.addChild(this.template.setting(data));
    }
    cOn.post({
      url:'/admin',
      someSettings:[
        ['setRequestHeader','content-type','application/json']
      ],
      data:jsonstr({
        type:'gettweaksdata'
      }),
      onload(){
        response(this.getJSONResponse());
      }
    })
    
  },
  openusers(){
    //req a setting first.
    const response = (data)=>{
      this.adminbody.addChild(this.template.users(data));
    }
    cOn.post({
      url:'/admin',
      someSettings:[
        ['setRequestHeader','content-type','application/json']
      ],
      data:jsonstr({
        type:'getuserlist'
      }),
      onload(){
        response(this.getJSONResponse());
      }
    })
    
  },
  openvoucher(){
    const response = (data)=>{
      this.adminbody.addChild(this.template.vouchers(data));
    }
    cOn.post({
      url:'/admin',
      someSettings:[
        ['setRequestHeader','content-type','application/json']
      ],
      data:jsonstr({
        type:'getvoucherlist'
      }),
      onload(){
        response(this.getJSONResponse());
      }
    })
  },
  opennews(){

  },
  openriwayat(){
    const response = (data)=>{
      console.log(data);
      this.adminbody.addChild(this.template.history(data));
    }
    cOn.post({
      url:'/admin',
      someSettings:[
        ['setRequestHeader','content-type','application/json']
      ],
      data:jsonstr({
        type:'gethistory'
      }),
      onload(){
        response(this.getJSONResponse());
      }
    })
  },
  opensetPrice(){
    const response = (data)=>{
      console.log(data);
      this.adminbody.addChild(this.template.setPrice(data));
    }
    cOn.post({
      url:'/admin',
      someSettings:[
        ['setRequestHeader','content-type','application/json']
      ],
      data:jsonstr({
        type:'getProductMarkupList'
      }),
      onload(){
        response(this.getJSONResponse());
      }
    })
  },
  navSetup(){
    const divs = this.main.findall('#buttons div');
    let activecc = divs[0]; 
    divs.forEach(button=>{
      button.onclick = ()=>{
        activecc.classList.remove('activecc');
        button.classList.add('activecc');
        activecc = button;
        this.adminbody.clear();
        this.state = `open${button.id}`;
        this[this.state]();
      }
    })
    activecc.classList.add('activecc');
    this.opensetting();
  },
  setuprefreshbutton(){
    this.content.find('#refreshbutton').onclick = ()=>{
      this.adminbody.clear();
      this[this.state]();
    }
  },
  setupNewVoucherButton(){
    this.content.find('#addvoucher').onclick = ()=>{
      this.adminbody.clear();
      this.adminbody.addChild(this.template.newVoucher());
    }
  },
  setupNewNewsButton(){
    this.content.find('#addnewsbutton').onclick = ()=>{

    }
  },
  setupNewMarkupButton(){
    this.content.find('#addmarkup').onclick = ()=>{
      this.adminbody.clear();
      this.adminbody.addChild(this.template.newMarkup());
    }
  },
  IUSaldo(){
    this.content.find('#addusersaldo').onclick = ()=>{
      this.adminbody.clear();
      this.adminbody.addChild(this.template.addUserSaldo());
    }
  },
  init(){
    this.navSetup();
    this.setuprefreshbutton();
    this.setupNewVoucherButton();
    this.setupNewMarkupButton();
    this.IUSaldo();
  }
}

admin.init();