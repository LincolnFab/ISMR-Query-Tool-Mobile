import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlotPageRoutingModule } from './plot-routing.module';

import { PlotPage } from './plot.page';
import { SatellitesComponent } from "../components/satellites/satellites.component";
import { SharedDirectivesModule } from '../directives/shared-directives.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlotPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [PlotPage, SatellitesComponent]
})
export class PlotPageModule {}
