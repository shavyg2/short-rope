import path from "path";
import glob from "glob";
import fs from "fs";
import _ from "lodash";
import async from "async";
import mkdir from "mkdirp";


export default class FishLineInterface{
  constructor(start,end){
    this.start =start;
    this.end = end;
  }


  boot(cb){
    this.loadStart();
    this.loadEnd();
    this.createStart(()=>{
      this.loadGlobs();
      this.transfer(()=>{
        if(_.isFunction(this.done)){
          this.done();
        }
        cb();
      });
    })
  }


  loadStart(){
    throw new Error("loadStart Interface needs to be implemented")
  }

  loadEnd(){
    this.end = this.end || process.cwd();
    this.end = path.resolve(this.end);
  }

  createStart(cb){
    cb();
  }


  readStart(){
    var rope_path = path.resolve(this.start,".rope");
    this._start_rope_content =  fs.readFileSync(rope_path,"utf8");
    this._start_rope = JSON.parse(this._start_rope_content);
  }


  loadGlobs(){
    let total_files = [];

    if(!this._start_rope || !this._start_rope_content){
      this.readStart();
    }

    for(let pathsearch of this._start_rope){
      pathsearch = path.join(this.start,pathsearch);
      let files = glob.sync(pathsearch);
      total_files = _.concat(total_files,files);
    }
    this.total_files = _(total_files).map(x=>path.resolve(x).replace(path.resolve(this.start),"")).value();
  }


  transfer(cb){
    var async_func = _(this.total_files).map(x=>({from:path.join(this.start,x),to:path.join(this.end,x)})).map(x=>{
      return function(next){
          mkdir(path.dirname(x.to),function(err){
            if(err)throw err;
            var _from = fs.createReadStream(x.from);
            var _to = fs.createWriteStream(x.to);
            _from.pipe(_to);
            _from.on("end",next);
          })
      }
    }).value();
    async.parallel(async_func,cb);
  }





}
