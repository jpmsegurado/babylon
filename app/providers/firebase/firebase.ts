import * as firebase from 'firebase';
import { Injectable } from '@angular/core';


@Injectable()
export class Firebase {

  constructor() {
    var config = {
        apiKey: "AIzaSyD719Dp49in9cb6WvWp9jCAr9a67Y89r2U",
        authDomain: "babylon-961af.firebaseapp.com",
        databaseURL: "https://babylon-961af.firebaseio.com",
        storageBucket: "babylon-961af.appspot.com",
    };
    firebase.initializeApp(config);
  }

  ref(str){
    return firebase.database().ref(str);
  }

  login(){
    let provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

}
