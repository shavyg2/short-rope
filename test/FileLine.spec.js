import chai from "chai";
import path from "path";
import fs from "fs";

const should = chai.should();
import FileLine from "../src/FileLine";


const FILELINEFROM = path.resolve(__dirname, "FileLineFrom")
const FILELINETO = path.resolve(__dirname, "FileLineTo");



describe('FileLine', () => {
  let line;
  before(function(done) {
    line = new FileLine(FILELINEFROM, FILELINETO);
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
