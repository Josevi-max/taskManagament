import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListToDoService {


  constructor(private _firestore: AngularFirestore) {}

  addToDoInList(listTaskId:string, nameToDo:string, orderList:number = 1): Promise<any> {
    var uidUser = JSON.parse(localStorage.getItem("user")!);

    const toDoList = {
      "name" : nameToDo,
      "state": false,
      "uid": uidUser.uid,
      "listTaskId": listTaskId,
      "favourite": false,
      "dateCreation": new Date().toLocaleDateString("es-Es"),
      "details": '',
      "orderList": orderList,
      "assignedTo": ''
    }
    return this._firestore.collection("toDoList").add(toDoList);
  }

  getToDoList(listTaskId:string): Observable<any> {
    var uidUser = JSON.parse(localStorage.getItem("user")!);
    return this._firestore.collection('toDoList', ref => ref.where('listTaskId', '==', listTaskId)/*.where("uid", "==", uidUser.uid )*/ ).snapshotChanges()
  }

  removeListToDo(listTaskId:string, nameListToDo: string = ''): Promise<any> {
    if(nameListToDo == '') {
      return this._firestore.collection('toDoList', ref => ref.where('listTaskId', '==', listTaskId)).get().forEach(value => {
        value.docs.forEach(element => {
          this._firestore.collection('toDoList').doc(element.id).delete();
        });
      });
    }
    return this._firestore.collection('toDoList', ref => ref.where('listTaskId', '==', listTaskId).where("name", "==", nameListToDo )).get().forEach(value => {
      value.docs.forEach(element => {
        this._firestore.collection('toDoList').doc(element.id).delete();
      });
    });
  }

  updateName(idToDo:string, name:string):Promise<any> {
    return this._firestore.collection('toDoList').doc(idToDo).update({'name':name});
  }

  changeStateToDo(idToDo:string, state:boolean):Promise<any> {
    return this._firestore.collection('toDoList').doc(idToDo).update({'state':state});
  }

  updateBackground(idToDo:string, background: string):Promise<any> {
    return this._firestore.collection('toDoList').doc(idToDo).update({'background':background});
  }

  changeImportantState(idToDo:string, important :boolean):Promise<any>{
    return this._firestore.collection('toDoList').doc(idToDo).update({'important':important});
  }

  updateDetails(idToDo:string, details:string):Promise<any> {
    return this._firestore.collection('toDoList').doc(idToDo).update({'details':details});
  }

  assingToNewUser(user:string, idList:string):Promise<any> {
    return this._firestore.collection('toDoList').doc(idList).update({'assignedTo':user});
  }

  releaseAssingedTask(idToDo:string):Promise<any>{
    return this._firestore.collection('toDoList').doc(idToDo).update({'assignedTo':''});

  }

  deleteToDo(idToDo:string):Promise<any> {
    return this._firestore.collection('toDoList').doc(idToDo).delete();
  }

}