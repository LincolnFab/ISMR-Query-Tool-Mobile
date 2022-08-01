import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideHeaderDirective } from './hide-header.directive';
import { DivActualizeDirective } from './div-actualize.directive';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    HideHeaderDirective,
    DivActualizeDirective
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    HideHeaderDirective,
    DivActualizeDirective,
    TranslateModule
  ]
})

export class SharedDirectivesModule { }
