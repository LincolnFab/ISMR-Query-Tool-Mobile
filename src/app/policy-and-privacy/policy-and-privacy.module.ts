import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PolicyAndPrivacyPageRoutingModule } from './policy-and-privacy-routing.module';

import { PolicyAndPrivacyPage } from './policy-and-privacy.page';
import { SharedDirectivesModule } from '../directives/shared-directives.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolicyAndPrivacyPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [PolicyAndPrivacyPage]
})
export class PolicyAndPrivacyPageModule {}
