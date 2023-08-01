import { Component, Directive, Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private toastr: ToastrService, private router: Router) {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required]
    });
   }

  login() {
    const user = this.loginForm.get('user')?.value;
    const password = this.loginForm.get('password')?.value;
    this.loading = true;
    this.afAuth.signInWithEmailAndPassword(user,password).then((answer)=>{
      console.log(answer);
      this.setLocalStorage(answer.user);
      this.toastr.success("Sesión iniciada correctamente");
      this.router.navigate(['']);
    },error => {
      this.loading = false;
      console.log(error);
      this.toastr.error("Error iniciando sesión revisa tus credenciales");
    });
  }

  setLocalStorage(user:any){
    const userData = {
      "uid" : user.uid,
      "email" : user.email,
      "name": user.displayName,
      "photoUrl": user.photoURL
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }

}
