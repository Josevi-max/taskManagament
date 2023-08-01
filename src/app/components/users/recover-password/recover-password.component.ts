import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  recoverForm: FormGroup;
  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private router: Router, private toastr: ToastrService) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
   
  }

  recoverPassword(){
    const email = this.recoverForm.get('email')?.value;
    this.afAuth.sendPasswordResetEmail(email).then(()=>{
      this.toastr.success('Te hemos enviado un email para recuperar tu password');
      this.router.navigate(['login']);
    }).catch(error =>{
      this.toastr.error('Usuario invalido');
    });
  }

}
