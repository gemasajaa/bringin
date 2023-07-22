
module.exports = function(req,res,db){
  db.ref('pendingregis').get().then(data=>{
    const newData = data.val();
	//handling time validity.
	const now = new Date().getTime();
	if(Number(req.query.valid)+(3600*24*1000)<now){
		return res.string(`
			<div
            style="
              width:100%;
              height:100%;
              display:flex;
              align-items:center;
              position:absolute;
              justify-content:center;
              top:0;left:0;
            "
            >
              <div
              style="
                width:30%;
                height:50%;
                display:flex;
                justify-content:center;
                flex-direction:column;
              "
              >  
                <div
                style="
                  font-size:24px;
                "
                >
                  Link Verifikasi Telah Kadaluwarsa!
                </div>
                <div>
                  Silahkan Lakukan Pendaftaran Ulang!
                </div>
              </div>
            </div>
            <script>
              setTimeout(()=>{location.href = "${newData[req.query.id].origin}";},2000)
            </script>`)
	}
    if(newData[req.query.id]){
      const datavalid = {
        email:newData[req.query.id].email,
        hp:newData[req.query.id].hp,
        name:newData[req.query.id].name,
        password:newData[req.query.id].password,
		    ballance:0,
        points:0,
        Trxs:[]
      }
      const emailfixed = datavalid.email.split('@');
      db.ref(`users/${emailfixed[0]}`).set(datavalid).then(()=>{
        db.ref(`pendingregis/${emailfixed[0]}`).remove().then(()=>{
          res.string(`
            <div
            style="
              width:100%;
              height:100%;
              display:flex;
              align-items:center;
              position:absolute;
              justify-content:center;
              top:0;left:0;
            "
            >
              <div
              style="
                width:30%;
                height:50%;
                display:flex;
                justify-content:center;
                flex-direction:column;
              "
              >  
                <div
                style="
                  font-size:24px;
                "
                >
                  Akun Anda Berhasil DiVerifikasi!
                </div>
                <div>
                  Silahkan Lakukan Login!
                </div>
              </div>
            </div>
            <script>
              setTimeout(()=>{location.href = "${newData[req.query.id].origin}";},2000)
            </script>
          `);
        })
      })
    }
  })
}