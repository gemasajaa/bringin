
module.exports = function(req,res,db){
  req.on('data',data=>{
    req.body = JSON.parse(data.toString());
    const schema = {
      gettweaksdata(req,res,db){
        db.ref('tweakdataconfig').get().then(data=>{
          const valueddata = data.val()||{};
          res.json(valueddata);
        })
      },
      getuserlist(req,res,db){
        db.ref('users').get().then(data=>{
          const valueddata = data.val()||{};
          res.json(valueddata);
        })
      },
      gethistory(req,res,db){
        db.ref('history').get().then(data=>{
          const valueddata = data.val()||{};
          res.json(valueddata);
        })
      },
      getvoucherlist(req,res,db){
        db.ref('vouchers').get().then(data=>{
          const valueddata = data.val()||{};
          res.json(valueddata);
        })
      },
      updatetweaks(req,res,db){
        db.ref('tweakdataconfig').update(req.body.data).then(()=>{
          res.json({valid:true});
        })
      },
      updatevoucher(req,res,db){
        db.ref('vouchers').update(req.body.vouchers).then(()=>{
          res.json({valid:true});
        })
      },
      updateMarkupPrice(req,res,db){
        db.ref('markupPriceList').update(req.body.vouchers).then(()=>{
          res.json({valid:true});
        })
      },
      deletevoucher(req,res,db){
        db.ref(`vouchers/${req.body.voucherid}`).remove().then(()=>{
          res.json({valid:true});
        })
      },
      deleteMarkupPrice(req,res,db){
        db.ref(`markupPriceList/${req.body.voucherid}`).remove().then(()=>{
          res.json({valid:true});
        })
      },
      buyyingvoucher(req,res,db){
        db.ref(`vouchers/${req.body.voucherid}`).get().then(data=>{
          const voucher = data.val()||{};
          if(!voucher.expired)return res.json({valid:false,msg:'Voucher Not Found!'})
          //check for voucher validity.
          const now = new Date().getTime();
          const vouchervalidtime = Number(Date.parse(voucher.expired));
          if(now>vouchervalidtime)return res.json({valid:false,msg:'Voucher expired'})
          db.ref(`users/${req.body.userinfo.split('@')[0]}`).get().then(data=>{
            const valueddata = data.val();
            if(valueddata.points<Number(voucher.gpointneeded))return res.json({valid:false,msg:'GPoints Not Enough!'});
            const currentVouchers = valueddata.vouchers||{};
            currentVouchers[voucher.id] = voucher;
            const points = valueddata.points - Number(voucher.gpointneeded);
            db.ref(`users/${req.body.userinfo.split('@')[0]}`).update({points,vouchers:currentVouchers}).then(()=>{
              res.json({valid:true,currentVouchers,points,msg:'Pembelian Voucher Anda Sukses!'});
            })
          })
        })
        
      },
      getProductMarkupList(req,res,db){
        db.ref('markupPriceList').get().then(data=>{
          const valueddata = data.val()||{};
          res.json(valueddata);
        })
      },
      admindeposit(req,res,db){
        db.ref(`users/${req.body.userData.email.split('@')[0]}`).get().then(data=>{
          const valuedData = data.val()||{};
          if(!valuedData.email){
            res.json({valid:false,msg:'User Not Found!'})
          }else{
            db.ref(`users/${req.body.userData.email.split('@')[0]}`).update({
              ballance:valuedData.ballance+Number(req.body.userData.saldo)
            }).then(()=>{
              res.json({valid:true,msg:'Topup Berhasil!'});
            })
          }
        })
      }
    }
    if(!schema[req.body.type]){
      res.json({valid:false,msg:'invalid type given'})
    }else schema[req.body.type](req,res,db);
  })
}