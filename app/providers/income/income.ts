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
export class Income {

  private _db: any;
  private _results: any;
  private whenUnblocked: any;
  private local: any;

  constructor(
    private firebase: Firebase
  ) {

      this._db = new PouchDB('income', {adapter: 'websql'});
      // this.removeAll();
      this._results;


      this.local = new Storage(LocalStorage);

    }


    deleteAll(){
      this._db.allDocs({include_docs: true},(err, docs) => {
         if (err) {
            return console.log(err);
         } else {
            console.log(docs.rows);
            docs.rows.forEach((item) => {
              this.simplyDelete(item.doc);
              console.log(item.doc);
            });
         }
      });
    }

    removeAll(){
      this.getAll().subscribe((res) => {
        res.map((item) => {
            this._db.remove(item);
        });
      });
    }

    add(result) {
      return Observable.fromPromise(this.local.get('facebook')).switchMap((resp: any) => {
        console.log(resp);
        if(JSON.parse(resp)){
          let userID = JSON.parse(resp).authResponse.userID;
          return Observable.fromPromise(this.firebase.ref(`users/${userID}/incomes`).push(result)).switchMap((res: any) => {
            console.log(res);
            result.key = res.key;
            return Observable.fromPromise(this._db.post(result));
          });
        }
      });
    }

    simplyAdd(result){
      return this._db.post(result);
    }

    simplyDelete(result){
      this._db.remove(result);
    }

    update(result) {
      return Observable.fromPromise(this.local.get('facebook')).switchMap((resp: any) => {
        console.log(resp);
        if(JSON.parse(resp)){
          let userID = JSON.parse(resp).authResponse.userID;
          return Observable.fromPromise(this.firebase.ref(`users/${userID}/incomes/${result.key}`).update(result)).switchMap((res: any) => {
            return Observable.fromPromise(this._db.put(result));
          });
        }
      });
    }

    delete(result) {
      return Observable.fromPromise(this.local.get('facebook')).switchMap((resp: any) => {
        console.log(resp);
        if(JSON.parse(resp)){
          let userID = JSON.parse(resp).authResponse.userID;
          console.log(result);
          return Observable.fromPromise(this.firebase.ref(`users/${userID}/incomes/${result.key}`).remove()).switchMap((res: any) => {
            return Observable.fromPromise(this._db.remove(result));
          });
        }
      });
    }

    getAll() {
      if (!this._results) {
        return Observable.fromPromise(this._db.allDocs({ include_docs: true })
          .then(docs => {
            // Each row has a .doc object and we just want to send an
            // array of birthday objects back to the calling controller,
            // so let's map the array to contain just the .doc objects.

            this._results = _.map(docs.rows,'doc');

            // Listen for changes on the database.
            this._db.changes({ live: true, since: 'now', include_docs: true })
                .on('change', (change) => {
                  let index = this._findIndex(this._results, change.id);
                  let result = this._results[index];

                  if (change.deleted) {
                    if (result) {
                      this._results.splice(index, 1); // delete
                    }
                  } else {
                    if (result && result._id === change.id) {
                      this._results[index] = change.doc; // update
                    } else {
                      this._results.splice(index, 0, change.doc) // insert
                    }
                  }
                });

            return this._results;
          }));
      } else {
        // Return cached data as a promise
        return Observable.create(observer =>{
          observer.next(this._results);
          observer.complete();
        });
      }
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
