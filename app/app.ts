import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import * as Chart from 'chart.js';
import  pouch from './providers/pouchdb/pouchdb';
import { Income } from './providers/income/income';
import { Outgoing } from './providers/outgoing/outgoing';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = HomePage;
  constructor(platform: Platform) {

  }
}

ionicBootstrap(MyApp, [Income, Outgoing]);
