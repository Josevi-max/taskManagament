import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListToDoService } from './list-to-do.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  
  idActualListTaskName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  actualListTaskName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  actualBackground: BehaviorSubject<string> = new BehaviorSubject<string>('');
  totalToDoTasks:BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private _firestore: AngularFirestore, private _list: ListToDoService) {
  }

  makeListTask(listTaskName:string): Promise<any> {
    var uidUser = JSON.parse(localStorage.getItem("user")!);

    const listTask = {
      "name" : listTaskName,
      "date": new Date(),
      "uid": uidUser.uid,
      "totalToDoTasks": 0,
      "background": 'default',
    }
    return this._firestore.collection("listTask").add(listTask);
  }

  getListsUsersById(id:string): Observable<any> {
    return this._firestore.collection('listTask', ref => ref.where('uid', '==', id)).snapshotChanges()
  }

  updateListName(idList:string,name:string): Promise<any> {
    this.actualListTaskName.next(name);
    return this._firestore.collection('listTask').doc(idList).update({'name':name});
  }

  updateTotalToDoListCount(idList:string, newValue:number):Promise<any>{
    return this._firestore.collection('listTask').doc(idList).update({'totalToDoTasks':newValue});
  }

  updateBackground(idTask:string, background:string, guest:boolean = false):Promise<any> {
    if(guest){
      return this._firestore.collection('invitations').doc(idTask).update({
        'background': background
      });
    } else {
      return this._firestore.collection('listTask').doc(idTask).update({'background':background});
    }
  }

  deleteList(idList:string): Promise<any> {
    this._list.removeListToDo(idList);
    return this._firestore.collection('listTask').doc(idList).delete();
  }
  
  getActualListTaskName(): BehaviorSubject<string> {
    return this.actualListTaskName;
  }

  getActualIdListTask(): BehaviorSubject<string> {
    return this.idActualListTaskName;
  }

  getTotalToDoTasks():  BehaviorSubject<number> {
    return this.totalToDoTasks;
  }

  getBackground(): BehaviorSubject<string> {
    return this.actualBackground;
  }

  setActualListTaskName(listTaskName: string, listIdTaskName: string) {
    this.actualListTaskName.next(listTaskName);
    this.idActualListTaskName.next(listIdTaskName);
  }

  setTotalToDoTasks(newCountToDoTasks: number) {
    this.totalToDoTasks.next(newCountToDoTasks);
  }

  setBackground(newBackground: string) {
    this.actualBackground.next(newBackground);
  }

  shareListWithUsers(uidGuest:string){
    var uidUser = JSON.parse(localStorage.getItem("user")!);

    const listTask = {
      "uidOwner": uidUser.uid,
      "uidGuest": uidGuest,
      "background": 'default'
    }
    this._firestore.collection("shareListTask").add(listTask);
  }

  getDataTaskShared(idListTask:string): Observable<any>{
    return this._firestore.collection('listTask').doc(idListTask).valueChanges();
  }

}
