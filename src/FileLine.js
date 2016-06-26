import FishLineInterface from "./FishLineInterface";
import path from "path";


export default class FileLine extends FishLineInterface{
  constructor(start,end){
    super(start,end);
  }


  loadStart(){
    this.start =  path.resolve(this.start);
  }
}
