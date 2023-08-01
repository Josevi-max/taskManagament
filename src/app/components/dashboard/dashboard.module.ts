import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { ListToDoComponent } from './list-to-do/list-to-do.component';
import { ListTasksComponent } from './list-tasks/list-tasks.component';
import { ShareListToDoComponent } from './share-list-to-do/share-list-to-do.component';
import { AssignListToDoComponent } from './assign-list-to-do/assign-list-to-do.component';

@NgModule({
  declarations: [
    NavbarComponent,
    HomeComponent,
    ListToDoComponent,
    ListTasksComponent,
    ShareListToDoComponent,
    AssignListToDoComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
  ]
})
export class DashboardModule { }
