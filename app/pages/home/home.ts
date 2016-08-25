import { Component, NgZone } from '@angular/core';
import { NavController, Storage, LocalStorage } from 'ionic-angular';
import { Income } from '../../providers/income/income';
import { Outgoing } from '../../providers/outgoing/outgoing';
import { IncomesPage } from '../incomes/incomes';
import { OutgoingsPage } from '../outgoings/outgoings';
import { AnalisePage } from '../analise/analise';
import moment from '../../providers/moment/moment';
import accounting from '../../providers/accounting/accounting';
import * as _ from 'lodash';
import { ConfigPage } from '../config/config';
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
  private month: any;
  private keepings: any;
  private investiments: any;
  private local: any;
  private userID: any;
  private db: any;
  private accounting: any = accounting;
  private loading: any = false;
  constructor(
    private nav: NavController,
    private IncomeService: Income,
    private OutgoingService: Outgoing,
    private zone: NgZone
  ) {
    let date = moment();
    this.month = date.month();
    this.local = new Storage(LocalStorage);
  }


  ionViewDidEnter(){
    this.loading = true;
    setTimeout(() => {
      this.init();
    }, 300);
    // this.deleteAll();
  }
  deleteAll(){
    this.OutgoingService.removeAll();
    this.IncomeService.removeAll();
  }


  openConfig(){
    this.nav.push(ConfigPage);
  }

  getLabel(month){
    let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[month];
  }

  init(){
    this.loading = true;
    this.local.get('percentagens').then((result) => {
      if(JSON.parse(result)){
        this.investiments = parseFloat(JSON.parse(result).investiments);
        this.keepings = parseFloat(JSON.parse(result).keepings);
      }else{
        this.investiments = 5;
        this.keepings = 10;
      }
    });

    this.local.get('facebook').then((result) => {
      if(JSON.parse(result)){
        this.userID = JSON.parse(result).authResponse.userID;
      }
    });

    this.IncomeService.getAll().subscribe((res) => {

      this.incomes = _.sumBy(this.getFilteredIncomes(res), (item) => {
        return parseFloat(item.valor);
      });
      this.OutgoingService.getAll().subscribe((res) => {
        this.outgoingsList = res;
        this.outgoingsList.sort((left, right) => {
          return left.data < right.data;
        });
        this.outgoings = _.sumBy(this.getFilteredOutgoings(res), (item) => {
          return parseFloat(item.valor);
        });

        this.rest = this.incomes - this.outgoings;
        this.loading = false;
      });
    });
  }

  saveIncomes(incomes){
    // let incomes = firebase.child('users');
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
      let mDate = moment(item.data);
      let date = moment(new Date());
      if((mDate.month() == date.month() && mDate.year() == date.year())){
        return true;
      }else{
        return false;
      }
    });

    return array;
  }

  getInvestiments(incomes: any): any{
    let prod = (this.investiments / 100) * incomes;
    let integer = Math.floor(prod);
    return integer;
  }

  getKeepings(incomes: any): any{
    let prod = (this.keepings / 100) * incomes;
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

  openAnalysis(inc, out, rest){
    let incomes = parseFloat(inc);
    let outgoings = parseFloat(out);
    let investiments = this.getInvestiments(incomes);
    let keepings = this.getKeepings(incomes);
    let fun =  rest - investiments - keepings > 0 ? rest - investiments - keepings : 0;
    if(incomes <= outgoings || incomes < outgoings + investiments + keepings){
        fun = 0;
        investiments = this.getInvestiments(rest);
        keepings = this.getKeepings(rest);
        fun =  rest - investiments - keepings > 0 ? rest - investiments - keepings : 0;
        if(incomes <= outgoings || incomes < outgoings + investiments + keepings){
            fun = 0;
            investiments = 0;
            keepings = 0;
        }

    }else if(incomes < outgoings + investiments + keepings + fun){
      fun = 0;
    }
    this.nav.push(AnalisePage, {incomes: incomes, outgoings: outgoings, investiments: investiments, keepings: keepings, rest: rest, fun: fun});
  }

}
