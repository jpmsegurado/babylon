import { Component } from '@angular/core';
import { NavController, LocalStorage, Storage } from 'ionic-angular';

/*
  Generated class for the ConfigPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/config/config.html',
})
export class ConfigPage {
  private local: any;
  private investiments: any;
  private keepings: any;
  constructor(private nav: NavController) {
    this.local = new Storage(LocalStorage);

    this.local.get('percentagens').then((result) => {
      if(JSON.parse(result)){
        this.investiments = JSON.parse(result).investiments;
        this.keepings = JSON.parse(result).keepings;
      }else{
        this.investiments = 5;
        this.keepings = 10;
      }
    });


  }

  saveConfig(keepings, investiments){
    this.local.set('percentagens', JSON.stringify({keepings: keepings, investiments: investiments}));
  }

  addKeepings(){
    this.keepings++;
    this.local.set('percentagens', JSON.stringify({keepings: this.keepings, investiments: this.investiments}));
  }
  subtractKeepings(){
    this.keepings--;
    this.local.set('percentagens', JSON.stringify({keepings: this.keepings, investiments: this.investiments}));
  }
  subtractInvestiments(){
    this.investiments--;
    this.local.set('percentagens', JSON.stringify({keepings: this.keepings, investiments: this.investiments}));
  }
  addInvestiments(){
    this.investiments++;
    this.local.set('percentagens', JSON.stringify({keepings: this.keepings, investiments: this.investiments}));
  }




}
