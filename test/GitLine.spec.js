import chai from "chai";
import path from "path";
import fs from "fs";

const should = chai.should();
import Line from "../src/GitHubLine";


const FILELINEFROM = "https://github.com/shavyg2/rope-test"
const FILELINETO = path.resolve(__dirname, "FileLineTo");



describe('GitLine', () => {
  let line;
  before(function(done) {
    line = new Line(FILELINEFROM, FILELINETO);
    line.boot(done);
  });

  it("should create src dir", function() {
    var stat = fs.statSync(path.join(FILELINETO, "src"));
    stat.isDirectory().should.equal(true);
  })

  it("should create src/random.txt", function() {
    var stat = fs.statSync(path.join(FILELINETO, "src/random.txt"));
    stat.isFile().should.equal(true);
  })

  it("should not copy random.txt",function () {

    let waste= function () {
      var stat = fs.statSync(path.join(FILELINETO, "random.txt"));
    }
    waste.should.throw(Error);
  })
});
