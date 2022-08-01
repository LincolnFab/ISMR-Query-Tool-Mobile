import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SkyplotPageRoutingModule } from './skyplot-routing.module';

import { SkyplotPage } from './skyplot.page';
import { SharedDirectivesModule } from '../directives/shared-directives.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SkyplotPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [SkyplotPage]
})
export class SkyplotPageModule {}
