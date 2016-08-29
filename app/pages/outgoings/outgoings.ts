import { Component, NgZone } from '@angular/core';
import { NavController, Alert } from 'ionic-angular';
import moment from '../../providers/moment/moment';
import { AddOutgoingPage } from '../add-outgoing/add-outgoing';
import { Outgoing } from '../../providers/outgoing/outgoing';
import accounting from '../../providers/accounting/accounting';

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
  private accounting: any = accounting;
  private date: any;
  private deleting: any = false;
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

  ionViewDidEnter(){
    this.init();
  }

  init(){
    this.zone.run(() => {
      this.OutgoingService.getAll().subscribe((res) => {
        console.log(res);
        this.outgoings = res;
      });
    });
  }

  getFilteredOutgoings(outgoings, date, month, year, actualYear){
    let array = [];
    array = outgoings.filter((item) => {
      let mDate = moment(item.data);
      if(((mDate.month()) == (date.month()) && mDate.year() == date.year())){
        return true;
      }else{
        if( item.tipo != '7'){
          return false;
        }else{
          let mDateFinal = moment(item.data_final);
          if(((mDateFinal.month()) <= (date.month()) && mDateFinal.year() <= date.year())){
            return false;
          }else{
            return true;
          }
        }
      }
    });

    return array;
  }

  edit(outgoing){
    this.nav.push(AddOutgoingPage, {outgoing: outgoing});
  }

  deleteOutgoing(outgoing, index){
    console.log(outgoing);
    let alert = Alert.create({
      subTitle: `Deseja deletar ${outgoing.descricao}?`,
      buttons: [{
        text: 'sim',
        handler: () => {
          console.log(outgoing);
          this.deleting = true;
          this.OutgoingService.deleteOnline(outgoing).subscribe(() => {
            this.OutgoingService.deletePouch(outgoing).subscribe(() => {
              this.init();
              this.zone.run(() => {
                this.deleting = false;
              });
            });
          });
        }
      }, {
        text: 'não'
      }]
    });
    this.nav.present(alert);
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

  formatData(data){
    let date = moment(data, 'YYYY-MM-DD');
    return date.format('DD/MM/YYYY');
  }

  getIcon(outgoing){
    switch(parseInt(outgoing.tipo)){
      case 0:
        return 'create';
      case 1:
        return 'bus';
      case 2:
        return 'home';
      case 3:
        return 'body';
      case 4:
        return 'medkit';
      case 5:
        return 'pizza';
      case 6:
        return 'more';
    }
  }

}
