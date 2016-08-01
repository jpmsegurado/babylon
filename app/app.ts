import { Component, enableProdMode } from '@angular/core';
import { Platform, ionicBootstrap, LocalStorage, Storage } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from './pages/home/home';
import { IntroPage } from './pages/intro/intro';
import * as Chart from 'chart.js';
import  pouch from './providers/pouchdb/pouchdb';
import { Income } from './providers/income/income';
import { Outgoing } from './providers/outgoing/outgoing';

enableProdMode();

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = HomePage;
  private local: any;
  constructor(platform: Platform) {
    this.local = new Storage(LocalStorage);
    this.local.get('logged').then((res) => {
      this.rootPage = JSON.parse(res) ? HomePage : IntroPage;
    });

  }
}

ionicBootstrap(MyApp, [Income, Outgoing]);
