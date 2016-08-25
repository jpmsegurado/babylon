import { Component, ElementRef } from '@angular/core';
import { FormBuilder, Validators, Control, ControlGroup } from '@angular/common';
import { NavController, Alert } from 'ionic-angular';
import { Income } from '../../providers/income/income';
import VMasker from '../../providers/vmasker/vmasker';
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
  constructor(
    private nav: NavController,
    private fb: FormBuilder,
    private IncomeService: Income,
    private el: ElementRef
  ) {
    this.income = new ControlGroup({
      descricao: new Control('', Validators.required),
      valor: new Control('0.00', Validators.required),
      data: new Control(''),
      tipo: new Control(0, Validators.required)
    });
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

    income.value.valor = (parseFloat(this.valor.slice(3, this.valor.length).replace(',', '.')) * 10).toFixed(2);

    this.loading = true;
    this.IncomeService.add(income.value).subscribe((res) => {
      this.nav.pop();
      this.loading = false;
    }, (res) => {
      console.log(res);
      this.loading = false;
    });

  }

  showBasicAlert(msg){
    let alert = Alert.create({
      subTitle: msg,
      buttons: ['ok']
    });
    this.nav.present(alert);
  }

}
