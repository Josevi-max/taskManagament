import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import 'firebase/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    AngularFirestoreModule
    
  ],
  providers: [
    { provide: AngularFireAuthModule , useValue: environment.firebase }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
