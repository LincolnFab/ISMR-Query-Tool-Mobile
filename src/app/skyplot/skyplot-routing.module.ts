import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkyplotPage } from './skyplot.page';

const routes: Routes = [
  {
    path: '',
    component: SkyplotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkyplotPageRoutingModule {}
