import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, LocalStorage, Storage } from 'ionic-angular';
import { Facebook } from 'ionic-native';
import { User } from '../../providers/user/user';
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
  constructor(
    private nav: NavController,
    private UserService: User
  ) {
    this.local = new Storage(LocalStorage);
  }

  ngOnInit(){
    this.loading = false;
  }

  entrar(){
    this.loading = true;
    if(!window['cordova']){
      let res = {
        authResponse: {
          userID: '1170904116305156'
        }
      }
      this.UserService.loadAllFromFirebase(res.authResponse.userID, (arr) => {
        Promise.all(arr).then(() => {
          this.loading = false;
          this.local.set('facebook', JSON.stringify(res));
          this.local.set('logged', true);
          this.nav.setRoot(HomePage, {}, {animate: false});
        });
      });

    }else{
      Facebook.login(['public_profile']).then((res) => {
        this.UserService.loadAllFromFirebase(res.authResponse.userID, (arr) => {
          if(arr.length == 0){
            this.loading = false;
            this.local.set('facebook', JSON.stringify(res));
            this.local.set('logged', true);
            this.nav.setRoot(HomePage, {}, {animate: false});
          }else{
            Promise.all(arr).then(() => {
              this.loading = false;
              this.local.set('facebook', JSON.stringify(res));
              this.local.set('logged', true);
              this.nav.setRoot(HomePage, {}, {animate: false});
            });
          }
        });
      }, () => {
        this.loading = false;
      });
    }
  }


  searchInfo(userID){

  }


}
