import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ListToDoService } from 'src/app/services/list-to-do.service';
import { ShareListService } from 'src/app/services/share-list.service';

@Component({
  selector: 'app-assign-list-to-do',
  templateUrl: './assign-list-to-do.component.html',
  styleUrls: ['./assign-list-to-do.component.css']
})
export class AssignListToDoComponent implements OnInit{
  @Input() idList:string = '';
  @Input() idToDoList:string = '';
  listGuestUsers:string[] = [''];
  asignUserForm:FormGroup;
  constructor(private _share: ShareListService, private fb: FormBuilder, private _list: ListToDoService, private toastr: ToastrService){
    this.asignUserForm = this.fb.group({
      assingnedUser: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._share.guestListGuest(this.idList).subscribe(
      (data)=>{
        this.listGuestUsers = [];
        data.forEach((element:any) => {
          if(!this.listGuestUsers.includes(element.payload.doc.data().emailGuest)) {
            this.listGuestUsers.push(element.payload.doc.data().emailGuest);
          }
          if(!this.listGuestUsers.includes(element.payload.doc.data().userMainEmail)) {
            this.listGuestUsers.push(element.payload.doc.data().userMainEmail);
          }
        });
      }
    )
  }

  assingUser(){
    if(this.asignUserForm.status == 'VALID'){
      var assignedTo = this.asignUserForm.get('assingnedUser')?.value;
      this._list.assingToNewUser(assignedTo,this.idToDoList).then(data => {
        document.getElementsByClassName('modal-backdrop')[0].classList.add('d-none');
        this.toastr.success('Tarea asignada');
      }).catch(error=> {
        this.toastr.warning('Parece que algo fallo');
      });
    }
  }

}
