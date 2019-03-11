import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arduino',
  templateUrl: './arduino.component.html',
  styleUrls: ['./arduino.component.css']
})
export class ArduinoComponent implements OnInit {

  tabObj : String[];
  tabArduino : ArduinoClass[];

  constructor() { }

  ngOnInit() {

      this.tabObj = [];
      this.tabArduino = [];

      // Temporary object
      this.tabObj.push("{\"mac\" : \"00:1B:44:11:3A:B7\", \"temperature\" : \"25.3\", \"expectedMaxTemp\" : \"24\", \"expectedMinTemp\" : \"19\" ,\"salle\" : \"C3\"}");
      this.tabObj.push("{\"mac\" : \"00:1B:44:11:3A:B7\", \"temperature\" : \"22\", \"expectedMaxTemp\" : \"24\", \"expectedMinTemp\" : \"19\" ,\"salle\" : \"C3\"}");

      this.populateTabArduino();
  }

  private populateTabArduino(){
      let i : int = 0;

      for(i; i < this.tabObj.length; i++){

          let jsObj : JSON = JSON.parse(this.tabObj[i]);

          this.tabArduino.push(new ArduinoClass(jsObj.mac, jsObj.temperature, jsObj.salle, jsObj.expectedMaxTemp, jsObj.expectedMinTemp));
      }
  }

  public isTempFine(obj : ArduinoClass){

      if(obj.isTempFine()){
          return true;
      }

      return false;
  }
}

class ArduinoClass {

    mac : string;
    temperature : string;
    expectedMaxTemp : string;
    expectedMinTemp : string;
    salle : string;

    constructor(mac : string, temperature : string, salle : string, expectedMaxTemp : string, expectedMinTemp : string){
        this.mac = mac;
        this.temperature = temperature;
        this.salle = salle;
        this.expectedMaxTemp = expectedMaxTemp;
        this.expectedMinTemp = expectedMinTemp;
    }

    isTempFine(){
        if(this.temperature < this.expectedMaxTemp && this.temperature > this.expectedMinTemp) {
            return true;
        }
        return false;
    }
}
