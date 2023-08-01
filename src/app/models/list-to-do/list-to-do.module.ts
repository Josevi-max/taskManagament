import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@Injectable({
  providedIn: 'root',
  useClass: ListToDoModule
})
export class ListToDoModule {
  id: string;
  uidUser: string;
  name: string;
  state: boolean;
  listTaskId: string;
  important: boolean;
  priority: number;
  dateCreation: Date;
  details: string;
  constructor(
    id: string,
    uidUser: string,
    name: string,
    state: boolean,
    listTaskId: string,
    important: boolean,
    priority: number,
    dateCreation: Date,
    details: string) {
      this.id = id;
      this.uidUser = uidUser;
      this.name = name;
      this.state = state;
      this.listTaskId = listTaskId;
      this.important = important;
      this.priority = priority;
      this.dateCreation = dateCreation;
      this.details = details;
    }
}
