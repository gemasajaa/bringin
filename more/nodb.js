//nodb, its a simple algorithm.
//gema working on it.
const fs = require('fs');
const path = require('path');
module.exports = {
  JSONDATA:{},
  set(newData){
    this.JSONDATA = newData;
  },
  save(callback){
    fs.writeFile(`${path.join(__dirname)}/db/${this.dbname}`,JSON.stringify(this.JSONDATA),(err)=>{
      if(err)throw err.code;
      //gonna write the handling later.
      if(callback)callback();
    })
  },
  openDb(name,callback){
    this.dbname = name;
    fs.readFile(`${path.join(__dirname)}/db/${name}`,(err,data)=>{
      if(err){
        //handling no file.
        if(err.code==='ENOENT'){
           this.JSONDATA = {};  
        }else throw err;
      }else{
        this.JSONDATA = JSON.parse(data.toString());  
      }
      if(callback)callback(this,err,data);
    });
  },
  add(dbname,endclose={},callback){
    this.JSONDATA = endclose;
    this.dbname = dbname;
    this.save(callback);
  }
}

