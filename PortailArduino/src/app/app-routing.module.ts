import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArduinoComponent } from "./arduino/arduino.component";

const routes: Routes = [
    { path: '', component: ArduinoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
