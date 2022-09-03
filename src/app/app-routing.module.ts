import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'plot',
    loadChildren: () => import('./plot/plot.module').then(m => m.PlotPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'historic',
    loadChildren: () => import('./historic/historic.module').then(m => m.HistoricPageModule)
  },
  {
    path: 'skyplot',
    loadChildren: () => import('./skyplot/skyplot.module').then(m => m.SkyplotPageModule)
  },
  {
    path: 'policy-and-privacy',
    loadChildren: () => import('./policy-and-privacy/policy-and-privacy.module').then( m => m.PolicyAndPrivacyPageModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(

  ) { }
}
