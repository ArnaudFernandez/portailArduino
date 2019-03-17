import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-arduino',
  templateUrl: './arduino.component.html',
  styleUrls: ['./arduino.component.css']
})
export class ArduinoComponent implements OnInit {

  static COUNT_LINES_URL : string = "http://localhost:8081/api/countAllLines";
  static GET_LAST_UPDATE : string = "http://localhost:8081/api/getLastUpdate";
  static TEST_CONNECTION_URL : string = "http://localhost:8081/api/connection";

  tabObj : String[];
  tabArduino : ArduinoClass[];
  lignesInDB : string;

  constructor(private http: HttpClient) { }

  ngOnInit() {

      this.tabObj = [];
      this.tabArduino = [];

      this.http.get(ArduinoComponent.GET_LAST_UPDATE).subscribe((data : any) => {

          for(let i = 0; i < data.length; i++){
              this.tabObj.push(data[i]);
          }
          console.log(this.tabObj);
          this.populateTabArduino();
      });



      this.lignesInDB = '0';
      this.http.get(ArduinoComponent.COUNT_LINES_URL).subscribe((data : any) => this.lignesInDB = data.data);

  }

  private populateTabArduino(){
      let i : number = 0;

      for(i; i < this.tabObj.length; i++){

          // @ts-ignore
          this.tabArduino.push(new ArduinoClass(this.tabObj[i].mac, this.tabObj[i].temperature, this.tabObj[i].salle, this.tabObj[i].max, this.tabObj[i].min));
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
