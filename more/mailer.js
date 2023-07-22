const nodemailer = require('nodemailer');
const mailerTransforter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'mrmongkeyy@gmail.com',
    pass:'iuxbxcerqssluupr'
  }
})
module.exports = function(onfine,onerror,details){
	mailerTransforter.sendMail(details, function(err) {
		if(err) {
			onerror();
		}else {
			onfine();
		}
	});
}