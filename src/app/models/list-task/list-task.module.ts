import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@Injectable({
  providedIn: 'root',
  useClass: ListTaskModule
})
export class ListTaskModule { 
  id: String;
  uidUser: String;
  name: String;
  date: Date;
  totalToDoTasks: number;
  background: string;
  constructor(
    id: String,
    uidUser: String,
    name: String,
    date: Date,
    totalToDoTasks: number,
    background: string,
    ) {
      this.id = id;
      this.uidUser = uidUser;
      this.name = name;
      this.date = date;
      this.totalToDoTasks = totalToDoTasks;
      this.background = background;
    }
}
