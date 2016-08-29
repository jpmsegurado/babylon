import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/fromPromise';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import PouchDB from '../pouchdb/pouchdb';
import _ from '../lodash/lodash';
import {LocalStorage, Storage} from 'ionic-angular';
import { Outgoing } from '../outgoing/outgoing';
import { Income } from '../income/income';

import { Firebase } from '../firebase/firebase';

@Injectable()
export class User {

  private _db: any;
  private _results: any;
  private whenUnblocked: any;
  private local: any;

  constructor(
    private firebase: Firebase,
    private OutgoingsService: Outgoing,
    private IncomesService: Income
  ) {

  }




    loadAllFromFirebase(userID, callback){
      this.firebase.ref(`users/${userID}`).once('value', (res: any) => {
        console.log(res.val());
        let promises = [];
        try{
          let incomes = res.val().incomes;
          let outgoings = res.val().outgoings;
          if(incomes){
            for(let income in incomes) {
              let obj = _.extend(incomes[income]);
              obj.key = income;
              promises.push(this.IncomesService.simplyAdd(obj));
            }
          }
          if(outgoings){
            for(let outgoing in outgoings) {
              let obj = _.extend(outgoings[outgoing]);
              obj.key = outgoing;
              promises.push(this.OutgoingsService.simplyAdd(obj));
            }
          }

          console.log(outgoings);
          console.log(incomes);
        }catch(e){
          callback([]);
        }

        callback(promises);

      });
      // return Observable.fromPromise(this.firebase.ref(`users/${userID}`).on());
    }



  }
