import { Component, NgZone } from '@angular/core';
import { NavController, Alert } from 'ionic-angular';
import moment from '../../providers/moment/moment';
import { AddIncomePage } from '../add-income/add-income';
import { Income } from '../../providers/income/income';

/*
  Generated class for the IncomesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/incomes/incomes.html',
})
export class IncomesPage {
  private month: Number;
  private actualYear: Number;
  private year: Number;
  private date: any;
  private incomes: Array<any> = [];
  constructor(
    private nav: NavController,
    private IncomeService: Income,
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
    this.IncomeService.getAll().subscribe((res) => {
      this.zone.run(() => {
        this.incomes = res;
        console.log(res);
      });
    });
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

  deleteIncome(income){
    let alert = Alert.create({
      subTitle: `Deseja deletar ${income.descricao}?`,
      buttons: [{
        text: 'sim',
        handler: () => {
          this.IncomeService.delete(income).subscribe(() => {
            this.init();
          });
        }
      }, {
        text: 'não'
      }]
    });
    this.nav.present(alert);
  }

  getFilteredIncomes(incomes, date, month, year, actualYear){
    let array = [];
    array = incomes.filter((item) => {
      let mDate = moment(item.date);
      if((mDate.month() == date.month() && mDate.year() == date.year() || item.tipo == 0)){
        return true;
      }else{
        return false;
      }
    });

    return array;
  }

  subtractMonth(){
    this.date.subtract(1, 'month');
    this.month = this.date.month();
    this.year = this.date.year();
  }

  add(){
    this.nav.push(AddIncomePage);
  }

}
