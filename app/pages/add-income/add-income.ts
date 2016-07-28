import { Component } from '@angular/core';
import { FormBuilder, Validators, Control, ControlGroup } from '@angular/common';
import { NavController, Alert } from 'ionic-angular';
import { Income } from '../../providers/income/income';

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
  constructor(
    private nav: NavController,
    private fb: FormBuilder,
    private IncomeService: Income
  ) {
    this.income = new ControlGroup({
      descricao: new Control('', Validators.required),
      valor: new Control('', Validators.required),
      data: new Control(''),
      tipo: new Control(0, Validators.required)
    });
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

    this.IncomeService.add(income.value).subscribe((res) => {
      this.nav.pop();
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
