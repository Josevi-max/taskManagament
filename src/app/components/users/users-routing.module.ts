import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "recover", component: RecoverPasswordComponent},
  {path: "register", component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
