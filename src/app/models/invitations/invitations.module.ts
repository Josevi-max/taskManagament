import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@Injectable({
  providedIn: 'root',
  useClass: InvitationsModule
})
export class InvitationsModule {
  id:string; 
  userMainEmail:string;
  userMainName: string;
  userMainPhoto: string;
  emailGuest: string;
  statusInvitation: string;
  listTaskId: string;
  nameList: string;
  idMain: string;
  idGuest: string;
  userGuestPhoto:string;
  constructor(
    id:string,
    userMainEmail:string,
    userMainName: string,
    idMain: string,
    idGuest: string,
    userMainPhoto: string,
    emailGuest: string,
    statusInvitation: string,
    listTaskId: string,
    nameList: string,
    userGuestPhoto:string,
  ){
    this.id = id;
    this.userMainPhoto = userMainEmail;
    this.userMainEmail = userMainEmail;
    this.userMainName = userMainName;
    this.emailGuest = emailGuest;
    this.statusInvitation = statusInvitation;
    this.listTaskId = listTaskId;
    this.nameList = nameList;
    this.idMain = idMain;
    this.idGuest = idGuest;
    this.userGuestPhoto = userGuestPhoto;
  }
}
