import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ListToDoModule } from 'src/app/models/list-to-do/list-to-do.module';
import { ListToDoService } from 'src/app/services/list-to-do.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css']
})
export class ListTasksComponent {
  @Input() listToDo: any;
  constructor(private _task: TasksService,private toastr: ToastrService, private _list: ListToDoService){

  }
  taskChanged(task:ListToDoModule) {
    this._list.changeStateToDo(task.id,!task.state).then(data => {
    }).catch(error => {
      this.toastr.error(error);
    });
  }

  importantChangeState(idToDo:string, important:boolean) {
    this._list.changeImportantState(idToDo,important).then(data => {

    }).catch(error => {
      this.toastr.error(error);
    });
  }
}
