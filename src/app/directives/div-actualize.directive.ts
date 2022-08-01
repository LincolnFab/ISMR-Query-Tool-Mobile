import { Directive, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Directive({
  selector: '[appDivActualize]'
})
export class DivActualizeDirective implements OnInit {
  @Input("appDivActualize") skyplot: any;

  constructor() { }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ngOnInit() {
    await this.sleep(500);

    console.log(this.skyplot.el);
  }

}
