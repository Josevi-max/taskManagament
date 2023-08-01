import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ListToDoModule } from 'src/app/models/list-to-do/list-to-do.module';
import { ListToDoService } from 'src/app/services/list-to-do.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-list-to-do',
  templateUrl: './list-to-do.component.html',
  styleUrls: ['./list-to-do.component.css']
})
export class ListToDoComponent implements OnInit{
  idListTask$: string = '';
  countListTask$: number = 0;
  @Input() toDo: any;
  constructor(private _task: TasksService, private fb: FormBuilder, private toastr: ToastrService, private _list: ListToDoService) {
  }

  ngOnInit(): void {
    console.log(this.toDo);
    this._task.getActualIdListTask().subscribe(
      (listIdTask: string) => {
        this.idListTask$ = listIdTask;
      }
    );

    this._task.getTotalToDoTasks().subscribe(
      (totalCount:number) => {
        this.countListTask$ = totalCount;
      }
    )
  }
  taskCompleted(task: ListToDoModule) {
    this._list.changeStateToDo(task.id, true).then(data => {
    }).catch(error => {
      this.toastr.error(error);
    });
  }

  taskUncompleted(task: ListToDoModule) {
    this._list.changeStateToDo(task.id, false).then(data => {
    }).catch(error => {
      this.toastr.error(error);
    });
  }

  importantChangeState(idToDo: string, important: boolean) {
    this._list.changeImportantState(idToDo, important).then(data => {

    }).catch(error => {
      this.toastr.error(error);
    });
  }

  addDetailsToDo(idToDo: string) {
    var isAllRight = true;
    var details = (<HTMLInputElement>document.getElementById("textArea-" + idToDo)).value;
    var newName = (<HTMLInputElement>document.getElementById("name-" + idToDo)).value;
    if (details) {
      this._list.updateName(idToDo, newName).then(data => {
      }).catch(error => {
        isAllRight = false;
        this.toastr.error(error);
      });

      this._list.updateDetails(idToDo, details).then(data => {
      }).catch(error => {
        isAllRight = false;
        this.toastr.error(error);
      });

    }

    if (isAllRight) {
      this.toastr.success('Detalles añadidos con exito a la tarea');
    }

  }

  deleteToDo(idToDo: string) {
    if (confirm('Estas seguro de querer borrar esta tarea ¿?')) {
      this._list.deleteToDo(idToDo).then(data => {
        this._task.updateTotalToDoListCount(this.idListTask$, --this.countListTask$).then(data => {
          this._task.setTotalToDoTasks(this.countListTask$);
          this.toastr.success('Tarea eliminada con exito');
        });
      }).catch(error => {
        console.log(error);
      });
    }
  }

  releaseAssignedTask(idToDo:string){
    this._list.releaseAssingedTask(idToDo).then(data=>{
      this.toastr.success('La tarea ya no esta asignada a nadie');
    })
  }
}
