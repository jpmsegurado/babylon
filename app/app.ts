import { Component, enableProdMode } from '@angular/core';
import { Platform, ionicBootstrap, LocalStorage, Storage } from 'ionic-angular';
import { StatusBar, Splashscreen, OneSignal } from 'ionic-native';
import { HomePage } from './pages/home/home';
import { IntroPage } from './pages/intro/intro';
import * as Chart from 'chart.js';
import  pouch from './providers/pouchdb/pouchdb';
import { Income } from './providers/income/income';
import { Firebase } from './providers/firebase/firebase';
import { Outgoing } from './providers/outgoing/outgoing';
import { User } from './providers/user/user';

enableProdMode();

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = HomePage;
  private local: any;
  constructor(platform: Platform) {
    Splashscreen.hide();
    this.local = new Storage(LocalStorage);
    this.local.get('logged').then((res) => {
      this.rootPage = JSON.parse(res) ? HomePage : IntroPage;
    });

    if(window['cordova']){

          OneSignal.init('d68c2739-edac-4629-99d6-fccfc82691bc',{googleProjectNumber: '1041665937886', autoRegister: true});
    }

  }
}

ionicBootstrap(MyApp, [Income, Outgoing, Firebase, User]);
