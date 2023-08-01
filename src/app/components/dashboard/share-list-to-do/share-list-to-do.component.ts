import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShareListService } from 'src/app/services/share-list.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-share-list-to-do',
  templateUrl: './share-list-to-do.component.html',
  styleUrls: ['./share-list-to-do.component.css']
})
export class ShareListToDoComponent implements OnInit{
  formShareList:FormGroup;
  idListTask$:string = '';
  nameListTask$:string = '';
  constructor(private fb: FormBuilder, private _task: TasksService, private _share: ShareListService, private toastr: ToastrService){
    this.formShareList = this.fb.group({
      email: ['', [Validators.required,Validators.email]]
    });
  }

  ngOnInit():void {
    this._task.getActualIdListTask().subscribe(
      (listIdTask: string) => {
        this.idListTask$ = listIdTask;
      }
    );
    this._task.getActualListTaskName().subscribe(
      (listTaskName: string) => {
        this.nameListTask$ = listTaskName;
      }
    );
  }
  

  shareList(){
    var emailGuest = this.formShareList.get('email')?.value;
    if(this.formShareList.valid) {
      this._share.haveWeMadeThisInvitationBefore(emailGuest,this.idListTask$).subscribe(otherInvitations=> {
        if(otherInvitations.length < 1) {
          this._share.saveInvitation(emailGuest,this.idListTask$,this.nameListTask$).then(data=>{
            if(data == undefined) {
              this.toastr.error('Algo fallo procesando su invitación');
            } else {
              this.toastr.success('Invitación enviada');
            }
            this.formShareList.reset();
          }).catch(error=>{
            this.toastr.error('Algo fallo procesando su invitación');
          })
        }
        
      })
      
    }else{
      this.toastr.warning('Parece que hubo un error con su formulario');
    }
  }
}
