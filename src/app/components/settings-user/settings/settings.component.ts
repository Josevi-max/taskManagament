import { Component, OnInit } from '@angular/core';
import { getAuth, updateEmail, updatePassword } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { updateProfile } from '@firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  eventFile: any;
  dataUserForm: FormGroup;
  dataUser = JSON.parse(localStorage.getItem("user")!);
  photoProfile = this.dataUser.photoUrl;
  loading = false;
  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router, private storage: AngularFireStorage, private _user:UsersService) {
    this.dataUserForm = this.fb.group({
      photoUrl: [''],
      nameUser: [this.dataUser.name, Validators.required],
      email: [this.dataUser.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['']
    }, { validators: this.notSamePassword });
  }

  ngOnInit() {
  }

  notSamePassword(group: FormGroup) {
    const pass = group.controls['password']?.value;
    const repatPass = group.controls['repeatPassword']?.value;
    var result = true;
    if (pass == repatPass) {
      result = false;
    }
    return result ? { samePassword: result } : result;
  }
  newPhoto(event: any) {
    this.eventFile = event;
    var reader = new FileReader();
    var element = document.getElementById('test');
    var resultReader = '';
    reader.onloadend = function () {
      if (typeof reader.result == 'string' && element) {
        element.setAttribute( 'src', reader.result);
      } 
    }
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  deleteAccount() {
    if(confirm('¿Estas seguro de querer borrar tu cuenta?')){
      localStorage.removeItem('user');
      this._user.deleteAccount();
      this.router.navigate(['/user']);
    }
  }

  updateDataUser(event: any) {
    const auth = getAuth();
    var newName = this.dataUserForm.get('nameUser');
    var email = this.dataUserForm.get('email');
    var password = this.dataUserForm.get('password');
    var photoURL = this.dataUserForm.get('photoUrl');
    var hasChanges = false;
    if (this.dataUserForm.invalid && (newName?.invalid || email?.invalid)) {
      this.toastr.warning('Revisa los datos de tu formulario');
      return;
    }

    if (photoURL?.value) {
      hasChanges = true;
      const file = this.eventFile.target.files[0];
      const uid = this.dataUser.uid;
      const filePath = `users/${uid}/profile.jpg`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      this.loading = true;
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            updateProfile(auth.currentUser!, {
              photoURL: url
            })
              .then(() => {
                this.dataUser.photo = url;
                debugger;
                localStorage.setItem('user', JSON.stringify(this.dataUser));
                console.log(url);
                this.toastr.success('Foto actualizada con exito');
                this.loading = false;
              }).catch(error => {
                this.toastr.warning('Algo fallo actualizando la foto');
                this.loading = false;
              })
          });
        })
      ).subscribe();
    }

    if (newName?.touched) {
      hasChanges = true;
      this.loading = true;
      updateProfile(auth.currentUser!, {
        displayName: newName?.value,
      }).then(data => {
        this.dataUser.name = newName?.value;
        localStorage.setItem('user', JSON.stringify(this.dataUser));
        this.toastr.success('Nombre actualizado con exito');
        this.loading = false;
      }, error => {
        this.toastr.warning('Parece que algo fallo al cambiar tu nombre');
        this.loading = false;
      });
    }

    if (email?.touched) {
      hasChanges = true;
      this.loading = true;
      updateEmail(auth.currentUser!, email?.value).then(() => {
        this.dataUser.email = email?.value;
        localStorage.setItem('user', JSON.stringify(this.dataUser));
        this.toastr.success('Email actualizado con exito');
        this.loading = false;
      }).catch((error) => {
        this.toastr.warning('Parece que algo fallo al cambiar tu email');
        this.loading = false;
      });
    }

    if (password?.value) {
      hasChanges = true;
      this.loading = true;
      updatePassword(auth.currentUser!, password?.value).then(() => {
        auth.signOut();
        localStorage.removeItem('user');
        this.toastr.success('Contraseña actualizada con exito');
        this.router.navigate(['']);
        this.loading = false;
      }).catch((error) => {
        this.toastr.warning('Parece que algo fallo al cambiar tu contraseña');
        this.loading = false;
      })
    }

    if (!hasChanges) {
      this.toastr.warning('No se ha modificado ningún dato del formulario');
    }

  }
}
