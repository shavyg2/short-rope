import _ from "lodash";
import GithubLine from "../GitHubLine";
import FileLine from "../FileLine"



var args = Array.prototype.slice.call(process.argv, 0);
var commands = _(args.slice(2)).map(x => x.toLowerCase()).value();
var type = commands[0];
var param = commands[1];


let Line;
switch (type) {
  case "github":
    Line = GithubLine;
    break;
  default:
    Line = FileLine;
}


let line = new Line(param);
line.boot(function() {
  console.log("Completed");
});
