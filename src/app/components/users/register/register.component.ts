import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private router: Router, private toastr: ToastrService) {
    this.registerForm = this.fb.group({
      userName: ['',Validators.required],
      userEmail: ['', [Validators.required,Validators.email]],
      userPassword: ['', [Validators.required,Validators.minLength(6)]],
      repeatPassword: ['']
    },{validators: this.notSamePassword});
  }

  register() {
    const userName = this.registerForm.get('userName')?.value;
    const userEmail = this.registerForm.get('userEmail')?.value;
    const password = this.registerForm.get('userPassword')?.value;
    var thiss = this; 
    var toastr = this.toastr;
    var router = this.router;
    this.loading = true;

    this.afAuth.createUserWithEmailAndPassword(userEmail,password).then(function(userCredential){
      var user = userCredential.user;
      // Update profile
      user?.updateProfile({
        displayName: userName
      }).then(function() {
        toastr.success('Usuario registrado de manera correcta');
        thiss.loading = false;
        thiss.setLocalStorage(user);
        router.navigate(['/dashboard']);
      }).catch(function(error) {
        toastr.warning('Error guandando el nombre del usuario: '+error.code);
        thiss.loading = false;
      });
    }).catch(error=>{
      toastr.warning('Error registrando al usuario: '+error.code);
      this.loading = false;
    });
    
  }
  
  notSamePassword(group: FormGroup) {
    const pass = group.controls['userPassword']?.value;
    const repatPass = group.controls['repeatPassword']?.value;
    var result = true;
    if(pass == repatPass){
      result = false;
    }
    return result?{samePassword: result}: result;
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
