const mailer = require('./mailer');
module.exports = function(req,res,db){
	req.on('data',data=>{
    req.body = JSON.parse(data.toString());
    const savetopending = ()=>{
      const fixedemail = req.body.email.split('@');
      db.ref(`pendingregis/${fixedemail[0]}`).set(req.body).then(()=>{
        req.body.id = fixedemail[0];
        mailer(()=>{
          res.json({
            valid:true,
            msg:'Email Sended'
          })
        },()=>{
          res.json({
            valid:true,
            msg:'Cannot Sending VEmail'
          })
        },{
          from:'gmarket.cyclic.app',
          to:req.body.email,
          subject:'Gmarket Verification Account!',
          text:'Just verify your email address!',
          html:`
            <div>
              <div>
                <div style="font-size:24px">Email Verification</div>
                <div>
                  Hallo ${req.body.name}, Selamat bergabung dengan GMARKET.<p>
                  Silahkan Verifikasi Akun Anda dengan mengklik Link Verifikasi Dibawah ini.
                </div>
                <div>
                <div>
                  <a href=${req.body.origin}/verifymyaccount?id=${req.body.id}&&valid=${req.body.timeStamp}>${req.body.origin}/verify?id=${req.body.id}&&valid=${req.body.timeStamp}</a></div>
                </div>
                <div>
                  Link akan kadaluwarsa dalam 24 jam, gunakan waktu anda dengan baik!
                </div>    
              </div>
            </div>
          `})
      })
    }
    db.ref('users').get().then((data)=>{
      const datanew = data.val()||{};
      if(datanew[req.body.email.split('@')[0]]){
        res.json({valid:false,msg:'Email exist'});
      }else{
        savetopending();
      }
    })
  })
}