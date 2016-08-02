import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ChartComponent} from '../../components/chart/chart';
import { HistoryPage } from '../history/history';

/*
  Generated class for the AnalisePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/analise/analise.html',
  directives: [ChartComponent]
})
export class AnalisePage {
  private incomes: any;
  private outgoings: any;
  private investiments: any;
  private keepings: any;
  private rest: any;
  private fun: any;
  constructor(
    private nav: NavController,
    private params: NavParams
  ) {
    this.incomes= params.get('incomes');
    this.outgoings = params.get('outgoings');
    this.investiments = params.get('investiments');
    this.keepings = params.get('keepings');
    this.rest = params.get('rest');
    this.fun = params.get('fun');

  }

  openHistory(){
    this.nav.push(HistoryPage);
  }

}
