import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ShareListService {
  dataUserMain = JSON.parse(localStorage.getItem("user")!);
  invitationsGuest: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  IdListTaskGuest: BehaviorSubject<string> = new BehaviorSubject<string>('false');
  constructor(private _firestore: AngularFirestore, private auth: AngularFireAuth) { }

  saveInvitation(emailGuest: string, idList: string, nameList: string): Promise<any> {

      const datRelationship = {
        "userMainEmail": this.dataUserMain.email,
        "userMainName": this.dataUserMain.name,
        "userMainPhoto": this.dataUserMain.photoUrl,
        "emailGuest": emailGuest,
        "statusInvitation": "Pending",
        "listTaskId": idList,
        "nameList": nameList,
        "idMain": this.dataUserMain.uid,
        "background": 'default'
      }
      return this._firestore.collection("invitations").add(datRelationship);
    
  }

  haveWeMadeThisInvitationBefore(emailGuest: string, idList: string): Observable<any>{
    return this._firestore.collection('invitations', ref => ref.where('emailGuest', '==', emailGuest).where('listTaskId', '==', idList)).snapshotChanges();
  }

  getDataInvitationsGuest(): Observable<any> {

    var result = this._firestore.collection('invitations', ref => ref.where('emailGuest', '==', this.dataUserMain.email)).snapshotChanges();
    if (result == undefined) {
      result = this._firestore.collection('invitations', ref => ref.where('idGuest', '==', this.dataUserMain.uid)).snapshotChanges();
    }

    this.invitationsGuest.next(result);
    return result;
  }

  getDataInvitationsMain(): Observable<any> {
    return this._firestore.collection('invitations', ref => ref.where('idMain', '==', this.dataUserMain.uid)).snapshotChanges();
  }

  manageInvitation(accept: string, idInvitation: string, idGuest: string, listTaskId: string = ''): Promise<any> {
    return this._firestore.collection('invitations').doc(idInvitation).update({ 'statusInvitation': accept, 'idGuest': idGuest, 'userGuestPhoto': this.dataUserMain.photoUrl });
  }

  getIdListTaskGuest() {
    return this.IdListTaskGuest;
  }

  setIdListTaskGuest(idGuest: string) {
    this.IdListTaskGuest.next(idGuest);
  }

  async pendingInvitations() {
    const querySnapshot = await this._firestore.collection('invitations', ref => ref.where('emailGuest', '==', this.dataUserMain.email).where('statusInvitation', '==', 'Pending')).get().toPromise();
    return querySnapshot?.docs ;
  }

  deleteInvitations(idInvitation: string): Promise<any> {
    return this._firestore.collection('invitations').doc(idInvitation).delete();
  }

  guestListGuest(idList:string): Observable<any>{
    return this._firestore.collection('invitations', ref => ref.where('listTaskId', '==', idList)).snapshotChanges();
  }

}
