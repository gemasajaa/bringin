module.exports = function(req,res,db){
    req.on('data',data=>{
        const userdata = JSON.parse(data.toString());
        db.ref(`users/${userdata.email.split('@')[0]}`).get().then(data=>{
            const valuedData = data.val()||{};
            if(userdata.confirmpassword!==valuedData.password){
                res.json({valid:false,msg:'Confirm Password Salah!'});
            }else{
                const toUpdate = {
                    name:userdata.name,
                    hp:userdata.hp,
                    password:userdata.newpassword||valuedData.password
                }
                db.ref(`users/${userdata.email.split('@')[0]}`).update(toUpdate).then(()=>{
                    res.json({valid:true,msg:'Perubahan Berhasil!',newsettingdata:toUpdate});
                })
            }
        })
    })
}