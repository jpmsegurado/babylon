import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Income } from '../../providers/income/income';
import { Outgoing } from '../../providers/outgoing/outgoing';
import { IncomesPage } from '../incomes/incomes';
import { OutgoingsPage } from '../outgoings/outgoings';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  private hideList: any = false;
  constructor(private nav: NavController) {

  }

  showList(){
    this.hideList = !this.hideList;
  }

  openAddOutgoing(){
    this.nav.push(OutgoingsPage);
  }

  openAddIncome(){
    this.nav.push(IncomesPage);
  }

}
