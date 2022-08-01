import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlotPage } from './plot.page';

const routes: Routes = [
  {
    path: '',
    component: PlotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlotPageRoutingModule {}
