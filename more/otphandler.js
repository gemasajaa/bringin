const mailer = require('./mailer');
module.exports = function(req,res,db){
  req.on('data',data=>{
    req.body = JSON.parse(data.toString());
    const userData = req.body.email.split('@')[0];
    db.ref(`users/${userData}`).get().then((datares)=>{
      const data = datares.val()||{};
      if(data.password){
        mailer(()=>{
          res.json({valid:true});
        },()=>{
          res.json({valid:false,msg:'Tidak Berhasil Mengirim Otp'});
        },
        {
          from:'gmarket.cyclic.app',
          to:req.body.email,
          subject:'G-Market OTP Password',
          text:'Just verify your email address!',
          html:`
            <div>
              <div>
                <div style="font-size:24px;margin-bottom:10px;">G-Market Password</div>
                <div>
                  Hallo ${data.name}, Password anda adalah <b>"${data.password}"</b>.<p>
                  Silahkan Login!
                </div>
              </div>
            </div>
          `
        })
      }else res.json({valid:false,msg:'Akun Tidak Ditemukan!'});
    })
  })
}