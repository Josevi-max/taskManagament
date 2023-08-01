import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsModuleRoutingModule } from './settings-module-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SettingsComponent } from '../settings/settings.component';


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsModuleRoutingModule,
    SharedModule,
  ]
})
export class SettingsModule { }
