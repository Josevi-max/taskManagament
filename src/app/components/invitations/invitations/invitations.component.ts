import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShareListService } from 'src/app/services/share-list.service';
import { InvitationsModule } from '../../../models/invitations/invitations.module';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {
  dataInvitations: InvitationsModule[] = [];
  manageInvitations: InvitationsModule[] = [];
  dataUser = JSON.parse(localStorage.getItem("user")!);
  constructor(private _share: ShareListService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this._share.getDataInvitationsGuest().subscribe(data => {
      this.dataInvitations = [];
      data.forEach((element: any) => {
        this.dataInvitations.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.dataInvitations);
    });

    this._share.getDataInvitationsMain().subscribe(data => {
      this.manageInvitations = [];
      data.forEach((element: any) => {
        this.manageInvitations.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
      console.log(this.manageInvitations)
    })
  }

  acceptInvitation(idInvitation: string, listTaskId:string) {
    this._share.manageInvitation('Accepted', idInvitation, this.dataUser.uid, listTaskId).then(data => {
      this.toastr.success('Invitación aceptada');
    }).catch(error => {
      this.toastr.warning('Error actualizando tu invitación');
      console.log(error);
    });
  }

  rejectInvitation(idInvitation: string) {
    this._share.manageInvitation('Rejected', idInvitation, this.dataUser.uid).then(data => {
      this.toastr.success('Invitación rechazada');
    }).catch(error => {
      this.toastr.warning('Error actualizando tu invitación');
    });
  }

  deleteInvitationUser(idInvitation: string){
    this._share.deleteInvitations(idInvitation).then(data=>{
      this.toastr.success('Compartición eliminada');
    }).catch(error => {
      this.toastr.warning('Error elimnando la compartición a este usuario');
    });
  }
}
