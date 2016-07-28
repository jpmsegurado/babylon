import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/fromPromise';
import {Observable} from 'rxjs/Observable';
import PouchDB from '../pouchdb/pouchdb';
import _ from '../lodash/lodash';

@Injectable()
export class Outgoing {

  private _db: any;
  private _results: any;
  private whenUnblocked: any;

  constructor() {

    this._db = (<any>window).cordova ? new PouchDB('outgoing', {adapter: 'websql'}) : new PouchDB('outgoing');
      // this._db.destroy();
      this._results;

      this.whenUnblocked = this.getAll();
    }

    add(result) {
      return Observable.fromPromise(this._db.post(result));
    }

    update(result) {
      return Observable.fromPromise(this._db.put(result));
    }

    delete(result) {
      return Observable.fromPromise(this._db.remove(result));
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
