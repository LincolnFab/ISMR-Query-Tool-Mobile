import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricPageRoutingModule } from './historic-routing.module';

import { HistoricPage } from './historic.page';
import { SharedDirectivesModule } from '../directives/shared-directives.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [HistoricPage]
})
export class HistoricPageModule {}
