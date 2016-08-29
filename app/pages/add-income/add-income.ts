import { Component, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators, Control, ControlGroup } from '@angular/common';
import { NavController, Alert, NavParams } from 'ionic-angular';
import { Income } from '../../providers/income/income';
import VMasker from '../../providers/vmasker/vmasker';
import moment from '../../providers/moment/moment';
import * as _ from 'lodash';

/*
  Generated class for the AddIncomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/add-income/add-income.html',
})
export class AddIncomePage {
  private income: any;
  private valor: any;
  private loading: any = false;
  private deleting: any = false;
  constructor(
    private nav: NavController,
    private zone: NgZone,
    private fb: FormBuilder,
    private IncomeService: Income,
    private params: NavParams,
    private el: ElementRef
  ) {
    if(!this.params.get('income')){
      this.income = new ControlGroup({
        descricao: new Control('', Validators.required),
        valor: new Control('', Validators.required),
        data: new Control(moment().toISOString()),
        tipo: new Control(0, Validators.required)
      });
    }else{
      let income = this.params.get('income');
      let valor = VMasker.toMoney(income.valor, {
        precision: 2,
        separator: ',',
        unit: 'R$'
      });
      this.income = new ControlGroup({
        descricao: new Control(income.descricao, Validators.required),
        valor: new Control('', Validators.required),
        data: new Control(moment(income.data, 'YYYY-MM-DD').toISOString(), Validators.required),
        tipo: new Control(income.tipo, Validators.required)
      });

      setTimeout(() => {
        this.income.controls.valor.updateValue(valor);
      });
    }
  }

  ngOnInit(){
    VMasker(this.el.nativeElement.querySelector('.valor input')).maskMoney({
      precision: 2,
      separator: ',',
      unit: 'R$'
    });

  }

  onChange(e){
    console.log(e);
  }

  deleteIncome(){
    let income = this.params.get('income');
    let alert = Alert.create({
      subTitle: `Deseja deletar ${income.descricao}?`,
      buttons: [{
        text: 'sim',
        handler: () => {
          this.deleting = true;
          this.IncomeService.delete(income).subscribe(() => {
            this.nav.pop();
            this.zone.run(() => {
              this.deleting = false;
            });
          });
        }
      }, {
        text: 'não'
      }]
    });
    this.nav.present(alert);
  }

  salvar(income: any){
    console.log(income);
    if(!income.valid){
      let names: any = [];
      for(let item in income.controls){
        if(!income.controls[item].valid){
          names.push(`'${item}'`);
        }
      }

      names = names.join(',');

      let msg = `Por favor preencha os campos ${names} corretamente`;
      console.log(names);
      console.log(msg);
      return this.showBasicAlert(msg);
    }

    this.loading = true;

    if(!this.params.get('income')){
      income.value.valor = (parseFloat(this.valor.slice(3, this.valor.length).replace(',', '.')) * 10).toFixed(2);
      this.IncomeService.add(income.value).subscribe((res) => {
        this.nav.pop();
        this.loading = false;
      }, (res) => {
        console.log(res);
        this.loading = false;
      });
    }else{
      let obj = _.extend(income.value);
      obj.key = this.params.get('income').key;
      obj._id = this.params.get('income')._id;
      obj._rev = this.params.get('income')._rev;

      if(!!income.controls.valor.dirty){
        income.value.valor = (parseFloat(income.value.valor.slice(3, income.value.valor.length).replace(',', '.')) * 10).toFixed(2);
      }else{
        income.value.valor = (parseFloat(income.value.valor.slice(3, income.value.valor.length).replace(',', '.'))).toFixed(2);
      }

      this.IncomeService.update(income.value).subscribe((res) => {
        this.nav.pop();
        this.loading = false;
      }, (res) => {
        console.log(res);
        this.loading = false;
      });

    }

  }

  showBasicAlert(msg){
    let alert = Alert.create({
      subTitle: msg,
      buttons: ['ok']
    });
    this.nav.present(alert);
  }

}
