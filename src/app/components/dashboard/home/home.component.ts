import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ListToDoModule } from 'src/app/models/list-to-do/list-to-do.module';
import { ListToDoService } from 'src/app/services/list-to-do.service';
import { ShareListService } from 'src/app/services/share-list.service';
import { TasksService } from 'src/app/services/tasks.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listToDo:ListToDoModule[] = [];
  listToDoCompleted:ListToDoModule[] = [];
  assignedTasks:ListToDoModule[] = [];
  myTasks:ListToDoModule[] = [];
  nameListTask$:string = '';
  idListTask$:string = '';
  countListTask$:number = 0;
  addTaskForm:FormGroup;
  showToDoCompletedList:boolean = true;
  background$:string = 'default';
  allTheElements:ListToDoModule[] = [];
  resultsSearch:ListToDoModule[] = [];
  idGuestList$:string = '';
  showAssignedTasks:boolean = false;
  hideMyTasks:boolean = false;
  constructor(private _task: TasksService, private fb: FormBuilder, private toastr: ToastrService, private _list: ListToDoService, private _share: ShareListService) {
    this.addTaskForm = this.fb.group({
      newTask: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this._task.getActualIdListTask().subscribe(
      (listIdTask: string) => {
        this.idListTask$ = listIdTask;
        console.log(listIdTask);
        this.getListTasks();
      }
    );

    this._task.getTotalToDoTasks().subscribe(
      (totalCount:number) => {
        this.countListTask$ = totalCount;
      }
    );

    this._task.getActualListTaskName().subscribe(
      (listTaskName: string) => {
        this.nameListTask$ = listTaskName;
      }
    );

    this._task.getBackground().subscribe(
      (background: string) => {
        this.background$ = background;
      }
    );
    
    this._share.getIdListTaskGuest().subscribe(
      (idGuestList: string) => {
        this.idGuestList$ = idGuestList;
      }
  );
    
  }

  addTask() {
    var validList = true;
    const newTaskValue = this.addTaskForm.get('newTask')?.value;
    if (this.addTaskForm.status == 'INVALID') {
      this.toastr.error("Debe de agregar una tarea válida");
      validList = false;
    }
    if(validList) {
      this._list.addToDoInList(this.idListTask$,newTaskValue,(this.countListTask$ + 1)).then(data => {
        this._task.updateTotalToDoListCount(this.idListTask$, ++this.countListTask$ ).then(data => {
          this._task.setTotalToDoTasks(this.countListTask$);
          this.toastr.success('Lista creada con exito');
        });
      }).catch(error => {
        this.toastr.error(error);
      });
      this.addTaskForm.reset();
    }
  }

  getListTasks() {
    var dataUser = JSON.parse(localStorage.getItem("user")!);
    console.log(dataUser);
    this._list.getToDoList(this.idListTask$).subscribe(data => {
      this.listToDo = [];
      this.listToDoCompleted = [];
      this.assignedTasks = [];
      this.myTasks = [];
      data.forEach((element: any) => {
        this.allTheElements.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
        if(element.payload.doc.data().assignedTo == dataUser.email && !element.payload.doc.data().state) {
          this.myTasks.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        }
        if(element.payload.doc.data().assignedTo != '' && !element.payload.doc.data().state){
          
          this.assignedTasks.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        }
        if(!element.payload.doc.data().state) {
          this.listToDo.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        } else {
          this.listToDoCompleted.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
        }
        
      });
      this.listToDo.sort(this.sortElementsArray);
      this.listToDoCompleted.sort(this.sortElementsArray)
      console.log('Tareas asignadas: '+this.myTasks);
    });
  }


  hideToDoCompleteList(){
    this.showToDoCompletedList = !this.showToDoCompletedList;
  }

  hideMyTasksAssigned(){
    this.hideMyTasks = !this.hideMyTasks;
  }

  hideAssignedToDoList(){
    this.showAssignedTasks = !this.showAssignedTasks;
  }

  importantChangeState(idToDo:string, important:boolean) {
    this._list.changeImportantState(idToDo,important).then(data => {

    }).catch(error => {
      this.toastr.error(error);
    });
  }

  sortElementsArray(elementA:any, elementB:any) {
    var result = -1;

    if(elementB.important) {
      result = 1;
    }

    if (elementB.important && elementA.important) {
      result = 0;
    }

    return result;
  }

  addDetailsToDo(idToDo:string) {
    var details = (<HTMLInputElement>document.getElementById("textArea-"+idToDo)).value;
    if(details) {
      this._list.updateDetails(idToDo,details).then(data=>{
        this.toastr.success('Detalles añadidos con exito a la tarea');
      }).catch(error => {
        console.log(error);
      });
    }
    
  }

  updateBackground(background:string) {
    var idList = this.idListTask$;
    var guest = false;
    if(this.idGuestList$ != 'false') {
      var idList = this.idGuestList$;
      var guest = true;
    }
    this._task.updateBackground(idList,background, guest).then(data => {
      this.toastr.success('Estilo actualizado');
      this._task.setBackground(background);
    }).catch(error => {
      this.toastr.warning('Error de conexión actualizado los datos');
    });
  }

  updateNameTask() {
    var element = (<HTMLInputElement>document.getElementById('nameTaskList'));
    this._task.updateListName(this.idListTask$,element.value).then( data=>{
      this._task.setActualListTaskName(element.value,this.idListTask$);
      element.classList.add('inputList');
      element.setAttribute('disabled', "true");
    });
  }

  activeInputNameTask(){
    var element = document.getElementById('nameTaskList') as HTMLElement;
    element.classList.remove('inputList');
    element.removeAttribute('disabled');
    element.focus();
  }

  searchInList(){
    var formSearch = document.getElementById('formSearch') as HTMLElement;
    var element = (<HTMLInputElement>document.getElementById('searchInList'));
    this.resultsSearch = [];
    if(element.value) {
      this.resultsSearch =  this.allTheElements.filter(filter => filter.name.indexOf(element.value) > -1);
    }
  }

  closeSeachList() {
    var formSearch = document.getElementById('formSearch') as HTMLElement;
    formSearch.classList.add('d-none');
  }
  showSearchInput(){
    var formSearch = document.getElementById('formSearch') as HTMLElement;
    formSearch.classList.remove('d-none');
  }

  removeList() {
    if(confirm('¿Estas seguro de querer borrar esta lista?')) {
      this._task.deleteList(this.idListTask$).then(data =>{
        this._task.setActualListTaskName("","");
        this._task.setBackground("default");
        this.toastr.success('Lista eliminada con exito');
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
