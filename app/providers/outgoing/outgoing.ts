import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/fromPromise';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import PouchDB from '../pouchdb/pouchdb';
import * as _ from 'lodash';
import {LocalStorage, Storage} from 'ionic-angular';

import { Firebase } from '../firebase/firebase';

@Injectable()
export class Outgoing {

  private _db: any;
  private _results: any;
  private whenUnblocked: any;
  private local: any;

  constructor(
    private firebase: Firebase
  ) {

      this._db = new PouchDB('outgoing');
      // this.removeAll();
      this._results;

      this.whenUnblocked = this.getAll();
      this.local = new Storage(LocalStorage);

    }

    deleteAll(){
      this._db.allDocs({include_docs: true},(err, docs) => {
         if (err) {
            return console.log(err);
         } else {
            console.log(docs.rows);
            docs.rows.forEach((item) => {
              this.deletePouch(item.doc);
              console.log(item.doc);
            });
         }
      });
    }

    removeAll(){
      this.getAll().subscribe((res: any) => {
        _.map(res, (item) => {
            this._db.remove(item);
        });
      });
    }

    add(result) {
      return Observable.fromPromise(this.local.get('facebook')).switchMap((resp: any) => {
        console.log(resp);
        if(JSON.parse(resp)){
          let userID = JSON.parse(resp).authResponse.userID;
          return Observable.fromPromise(this.firebase.ref(`users/${userID}/outgoings`).push(result)).switchMap((res: any) => {
            result.key = res.key;
            return Observable.fromPromise(this._db.post(result));
          });
        }
      });
    }

    simplyAdd(result){
      return this._db.post(result);
    }

    update(result) {
      return Observable.fromPromise(this.local.get('facebook')).switchMap((resp: any) => {
        console.log(resp);
        if(JSON.parse(resp)){
          let userID = JSON.parse(resp).authResponse.userID;
          return Observable.fromPromise(this.firebase.ref(`users/${userID}/outgoings/${result.key}`).update(result)).switchMap((res: any) => {
            return Observable.fromPromise(this._db.put(result));
          });
        }
      });
    }

    deleteOnline(result) {
      return Observable.fromPromise(this.local.get('facebook')).switchMap((resp: any) => {
        console.log(resp);
        if(JSON.parse(resp)){
          let userID = JSON.parse(resp).authResponse.userID;
          console.log(result);
          return Observable.fromPromise(this.firebase.ref(`users/${userID}/outgoings/${result.key}`).remove());
        }
      });
    }

    deletePouch(result){
      return Observable.fromPromise(this._db.remove(result));
    }


    loadAllFromFirebase(userID){
      this.firebase.ref(`users/${userID}`).once('value', (res: any) => {
        console.log(res.val());
      });
      // return Observable.fromPromise(this.firebase.ref(`users/${userID}`).on());
    }

    getAll() {
      return Observable.fromPromise(this._db.allDocs({ include_docs: true })
        .then(docs => {
          // Each row has a .doc object and we just want to send an
          // array of birthday objects back to the calling controller,
          // so let's map the array to contain just the .doc objects.

          this._results = _.map(docs.rows,'doc');
          console.log(this._results);
          return this._results;
        }));
    }

    _findIndex (array, id) {
      let low = 0, high = array.length, mid;
      while (low < high) {
          mid = (low + high) >>> 1;
          array[mid]._id < id ? low = mid + 1 : high = mid
      }
      return low;
    }


}
