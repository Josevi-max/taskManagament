import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timeout } from 'rxjs';
import { ListTaskModule } from 'src/app/models/list-task/list-task.module';
import { ListToDoModule } from 'src/app/models/list-to-do/list-to-do.module';
import { ShareListService } from 'src/app/services/share-list.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  addListForm: FormGroup;
  searchForm: FormGroup;
  listTasks: ListTaskModule[] = [];
  searchListTask: ListTaskModule[] = [];
  timeOut: any;
  suscriptionListTask: Subscription = new Subscription;
  nameUser : string = '';
  dataUser = JSON.parse(localStorage.getItem("user")!);
  invitationsGuest$:any= [];
  areInvitationsPending$ = false;
  constructor(private router: Router, private _task: TasksService, private fb: FormBuilder, private toastr: ToastrService, private _share: ShareListService) {
    this.addListForm = this.fb.group({
      newList: ['', Validators.required]
    });
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.getListsUser();
    this.invitationsGuest$ = [];
    this._share.getDataInvitationsGuest().subscribe(
      (invitationsGuest: any) => {
        invitationsGuest.forEach((element: any) => {
          console.log("Iteración: "+element);
          if (element.payload.doc.data().statusInvitation == 'Accepted') {
            this.invitationsGuest$ = [];
            this.getDataListShared(element.payload.doc.data().listTaskId).subscribe(
              (data:any)=>{
                var dataList = {
                  id: element.payload.doc.id,
                  name: data.name,
                  totalToDoTasks: data.totalToDoTasks,
                  ui: data.uid,
                  ...element.payload.doc.data()
                }
                var isDuplicated = false;
                console.log(this.invitationsGuest$);
                this.invitationsGuest$.forEach((element:any) => {
                  if(element.id == dataList.id){
                    isDuplicated = true;
                    this.invitationsGuest$.splice(element, 1, dataList);
                  }
                });
                if (!isDuplicated) {
                  this.invitationsGuest$.push(dataList);
                }
              }
            );
          }
        });
      }
    );
    this._share.pendingInvitations().then(
      data => {
        if (data != undefined) {
          this.areInvitationsPending$ = data.length > 0;
          console.log(data.length > 0);
        }
      }
    )
    
  }

  ngOnDestroy(): void {
    this.suscriptionListTask.unsubscribe();
  }

  addList() {
    var validList = true;
    const newListName = this.addListForm.get('newList')?.value;
    if (this.addListForm.status == 'INVALID') {
      this.toastr.error("Debe de agregar una lista válida");
      validList = false;
    }
    this.listTasks.forEach(list => {
      if (list.name === newListName) {
        this.toastr.error("Ya tienes una lista con ese nombre");
        validList = false;
      }
    });
    if (validList) {
      this._task.makeListTask(newListName).then(data => {
        this.toastr.success('Lista creada con exito');
      }).catch(error => {
        this.toastr.error(error);
      });
      this.addListForm.reset();
    }
  }

  logOut() {
    const auth = getAuth();
    auth.signOut();
    localStorage.removeItem('user');
  }

  getListsUser() {
    var idUser = this.dataUser.uid;
    this.nameUser = this.dataUser.name
    if (idUser) {
      this.suscriptionListTask = this._task.getListsUsersById(idUser).subscribe(data => {
        this.listTasks = [];
        data.forEach((element: any) => {
          this.listTasks.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          })
        });
        this.searchListTask = this.listTasks;
      })

      console.log(this.listTasks);
    }
  }

  activeInput(list: any) {
    //var nameList = list.substring(0,list.indexOf(' '));
    var className = "desktop-"+list ;

    var element = document.getElementsByClassName(className)[0] as HTMLElement;
    element.classList.remove('inputList');
    element.removeAttribute('disabled');
    element.focus();
  }

  sendAndDisabled(list: any,listName:any) {
    debugger;
    var className = "desktop-"+list;
    var name = (<HTMLInputElement>document.getElementsByClassName(className)[0]).value;
    if(name && listName != name) {
      this._task.updateListName(list,name).then(data => {
        this.toastr.success('Lista actualizada con exito');
      }).catch(error => {
        console.log(error);
      })
    }
    document.getElementsByClassName(className)[0].classList.add('inputList');
    document.getElementsByClassName(className)[0].setAttribute('disabled', "true");
  }

  removeList(idList: any) {
    if(confirm('¿Estas seguro de querer borrar esta lista?')) {
      this._task.deleteList(idList).then(data =>{
        this._task.setActualListTaskName("","");
        this._task.setBackground("default");
        this.toastr.success('Lista eliminada con exito');
      }).catch(error => {
        console.log(error);
      });
    }
  }

  searchInList():void {
    let nameList = this.searchForm.get('search')?.value;
    this.searchListTask = this.listTasks;
    debugger;
    if (nameList) {
      let results = this.searchListTask.filter(filter => filter.name.indexOf(nameList) > -1);
      this.searchListTask = results;
    }
  }

  currentListTask(nameList:any, totalToDoList: number, listId: any, background: string):void {
    this._task.setActualListTaskName(nameList, listId);
    this._task.setTotalToDoTasks(totalToDoList);
    this._task.setBackground(background);
  }

  getDataListShared(listTaskId:string){
    this.invitationsGuest$ = [];
    return this._task.getDataTaskShared(listTaskId);
  }

  setGuestList(idListGuest:string){
    this._share.setIdListTaskGuest(idListGuest);
  }

}

window.addEventListener('resize',checkOffCanvas);
window.addEventListener('load',checkOffCanvas);

function checkOffCanvas(){
  var elementOffCanvas = document.getElementById('offcanvasDesktop');
  var elementOffCanvasMobile = document.getElementById('offcanvasExample');
  var backOffCanvas = document.getElementsByClassName('offcanvas-backdrop');
  var width = screen.width;

  if(width > 768) {
    elementOffCanvas?.classList.add("show");
    elementOffCanvasMobile?.classList.remove('show');
    backOffCanvas[0]?.classList.remove('show');
  }
}