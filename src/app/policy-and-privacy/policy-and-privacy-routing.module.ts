import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolicyAndPrivacyPage } from './policy-and-privacy.page';

const routes: Routes = [
  {
    path: '',
    component: PolicyAndPrivacyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyAndPrivacyPageRoutingModule {}
