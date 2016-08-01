import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, LocalStorage, Storage } from 'ionic-angular';
import { HomePage } from '../home/home';

/*
  Generated class for the IntroPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/intro/intro.html',
})
export class IntroPage {
  @ViewChild('introSlider') slider: Slides;
  private loading: any = true;
  private local: any;
  constructor(private nav: NavController) {
    this.local = new Storage(LocalStorage);
  }

  ngOnInit(){
    this.loading = false;
  }

  entrar(){
    this.nav.setRoot(HomePage, {}, {animate: false});
    this.local.set('logged', true);
  }


}
