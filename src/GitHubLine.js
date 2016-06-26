import FileLine from "./FileLine";
import path from "path";
import isGit from "is-git-url";
import fs from "fs";
import tmp from "tmp";
import unzip from "unzip"
import request from "request";
import re from "replace-ext";
import glob from "glob";

const gitshort = /^[^/]+\/[^/]+$/;

export default class GithubLine extends FileLine {
  constructor(start, end) {
    super(start, end);
  }

  loadStart() {
    if (this.isGitShort(this.start)) {
      this.start = this.parseGitShort(this.start);
    }
    this.start = this.start.replace(/\.git$/,"");

    this.start = this.parseTag(this.start);

  }


  createStart(cb) {
    this.start = this.transformToZip(this.start);
    this.download(this.start, cb);
  }

  transformToZip(url) {
    //Example
    //https://github.com/some/repo#master

    var repo = url.split("#");
    let download_url = `${repo[0]}/archive/${repo[1]}.zip`;
    return download_url;
  }

  download(url, cb) {
    var pkg = request({
      url,
      method: "get"
    });

    var temp_file = tmp.fileSync();
    var temp_dir = tmp.dirSync();
    temp_file.name = re(temp_file.name, ".zip");
    temp_file.removeCallback = function() {
      fs.unlink(temp_file.name);
    }

    this.done = function() {
      // temp_file.removeCallback();
      // temp_dir.removeCallback();
    }



    let out = fs.createWriteStream(temp_file.name);
    pkg.pipe(out);

    pkg.on("end", () => {
      var extract = require('extract-zip')
      extract(temp_file.name, {
        dir: temp_dir.name
      }, (err)=> {
        if(err){
          console.log(err);
        }

        var rope_file = path.join(temp_dir.name,"**/.rope");
        let glob_result = glob.sync(rope_file);
        rope_file = glob_result[0];
        this.start = path.dirname(rope_file);
        cb();
      })
    });
  }

  parseTag(url) {
    url = url.split("#");
    return url.length > 1 ? url.join("#") : `${url[0]}#master`;
  }

  isGitShort(url) {
    return gitshort.test(url);
  }

  parseGitShort(short) {
    return path.join("https://github.com/", this.parseTag(short));
  }



}
