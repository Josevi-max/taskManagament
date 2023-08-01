import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, deleteUser } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _firestore: AngularFirestore) {
    
  }

  deleteAccount() {
    const userData = getAuth().currentUser;
    
    return userData?.delete();
  }
}
