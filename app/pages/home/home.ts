import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Income } from '../../providers/income/income';
import { Outgoing } from '../../providers/outgoing/outgoing';
import { IncomesPage } from '../incomes/incomes';
import { OutgoingsPage } from '../outgoings/outgoings';
import { AnalisePage } from '../analise/analise';
import moment from '../../providers/moment/moment';
import * as _ from 'lodash';

import * as Chart from 'chart.js';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  private incomes:any = 0;
  private outgoings:any = 0;
  private outgoingsList:any = [];
  private hideList: any = false;
  private rest: any = 0;
  constructor(
    private nav: NavController,
    private IncomeService: Income,
    private OutgoingService: Outgoing
  ) {

  }


  ionViewDidEnter(){
    this.init();
  }

  getIcon(outgoing){
    switch(outgoing.tipo){
      case 0:
        return 'create';
      case 1:
        return ''
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
    }
  }

  init(){
    this.IncomeService.getAll().subscribe((res) => {
      this.incomes = _.sumBy(this.getFilteredIncomes(res), (item) => {
        return parseInt(item.valor);
      });
      this.OutgoingService.getAll().subscribe((res) => {
        this.outgoingsList = res;
        this.outgoingsList.sort((left, right) => {
          return left.data < right.data;
        });
        this.outgoings = _.sumBy(this.getFilteredOutgoings(res), (item) => {
          return parseInt(item.valor);
        });

        this.rest = this.incomes - this.outgoings;
      });
    });
  }

  canSaveAndInvest(rest: any){
    let investiments = this.getInvestiments(rest);
    let keepings = this.getKeepings(rest);

    if(rest < investiments + keepings){
      return false;
    }else{
      return true;
    }

  }

  getFilteredIncomes(incomes){
    let array = [];
    array = incomes.filter((item: any) => {
      let date = moment(new Date());
      let mDate = moment(item.data, 'YYYY-MM-DD');
      if((mDate.month() == date.month() && mDate.year() == date.year() || item.tipo == 0)){
        return true;
      }else{
        return false;
      }
    });

    return array;
  }

  getFilteredOutgoings(outgoings){
    let array = [];
    array = outgoings.filter((item) => {
      let mDate = moment(item.date);
      let date = moment(new Date());
      if((mDate.month() == date.month() && mDate.year() == date.year())){
        return true;
      }else{
        return false;
      }
    });

    return array;
  }

  getInvestiments(rest: any): any{
    let prod = 0.05 * rest;
    let integer = Math.floor(prod);
    return integer;
  }

  getKeepings(rest: any): any{
    let prod = 0.1 * rest;
    let integer = Math.floor(prod);
    return integer;
  }

  showList(event){
    this.hideList = !this.hideList;
  }

  openAddOutgoing(event){
    this.nav.push(OutgoingsPage);
  }

  openAddIncome(event){
    this.nav.push(IncomesPage);
  }

  openAnalysis(incomes, outgoings, rest){
    let investiments = this.getInvestiments(rest);
    let keepings = this.getKeepings(rest);

    if(rest < investiments + keepings){
        investiments = 0;
        keepings = 0;
    }
    this.nav.push(AnalisePage, {incomes: incomes, outgoings: outgoings, investiments: investiments, keepings: keepings, rest: rest});
  }

}
