import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import moment from '../../providers/moment/moment';
import { AddOutgoingPage } from '../add-outgoing/add-outgoing';
import { Outgoing } from '../../providers/outgoing/outgoing';

/*
  Generated class for the OutgoingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/outgoings/outgoings.html',
})
export class OutgoingsPage {
  private month: Number;
  private actualYear: Number;
  private year: Number;
  private date: any;
  private outgoings: any = [];
  constructor(
    private nav: NavController,
    private OutgoingService: Outgoing,
    private zone: NgZone
  ) {
    this.date = moment();
    this.month = this.date.month();
    this.year = this.date.year();
    this.actualYear = this.date.year();
  }

  ngOnInit(){
    this.init();
  }

  init(){
    this.zone.run(() => {
      this.OutgoingService.getAll().subscribe((res) => {
        this.outgoings = res;
        console.log(res);
      });
    });
  }

  getFilteredOutgoings(outgoings, date, month, year, actualYear){
    let array = [];
    array = outgoings.filter((item) => {
      let mDate = moment(item.date);
      if((mDate.month() == date.month() && mDate.year() == date.year())){
        return true;
      }else{
        return false;
      }
    });

    return array;
  }

  getLabel(month, year, actualYear){
    let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    let label = year == actualYear ? months[month] : months[month].substring(0, 3) + '/' + year;
    return label;
  }

  addMonth(){
    this.date.add(1, 'month');
    this.month = this.date.month();
    this.year = this.date.year();
  }

  subtractMonth(){
    this.date.subtract(1, 'month');
    this.month = this.date.month();
    this.year = this.date.year();
  }

  add(){
    this.nav.push(AddOutgoingPage)
  }

}
