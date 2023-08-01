import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: "", redirectTo: '/dashboard', pathMatch: 'full'},
  {path: "dashboard", loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),canActivate:[AuthGuard]},
  {path: "user", loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule)},
  {path: "settings", loadChildren: () => import('./components/settings-user/settings-module/settings-module.module').then(m => m.SettingsModule),canActivate:[AuthGuard]},
  {path: "invitations", loadChildren: () => import('./components/invitations/invitations.module').then(m => m.InvitationsModule),canActivate:[AuthGuard]},
  {path: "**", redirectTo: "/", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
