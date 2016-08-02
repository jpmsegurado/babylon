import { Component, NgZone } from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common' ;
import { NavController, Platform, Alert } from 'ionic-angular';
import { DatePicker } from 'ionic-native';
import { Outgoing } from '../../providers/outgoing/outgoing';
import moment from '../../providers/moment/moment';
import * as _ from 'lodash';

/*
  Generated class for the AddOutgoingPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/add-outgoing/add-outgoing.html',
})
export class AddOutgoingPage {
  private outgoing: any;
  private data: any;
  private loading: any = false;
  constructor(
    private nav: NavController,
    private platform: Platform,
    private OutgoingService: Outgoing,
    private zone: NgZone,
    private fb: FormBuilder
  ) {
    this.outgoing = new ControlGroup({
      descricao: new Control('', Validators.required),
      valor: new Control('', Validators.required),
      data: new Control('', Validators.required),
      tipo: new Control(0, Validators.required)
    });
  }

  pickDate(data){
    console.log(window['cordova']);
    if(!window['cordova']){
      // this.data = moment(new Date()).format('DD/MM/YYYY');
      this.data = moment(new Date('2016-07-28')).format('DD/MM/YYYY');
      return;
    }
    DatePicker.show({
      date: new Date(),
      mode: 'date'
    }).then(
      (date: any) => {
        this.zone.run(() => {
        setTimeout(() => {
          let day: any = date.getDate();
          let month: any = date.getMonth() + 1;
          if(day < 10){
            day = "0"+day;
          }
          if(month < 10){
            month = "0"+month;
          }

          let time = day+"/"+month+"/"+(date.getYear() + 1900);
          this.data = time;
        },100);
      });
      },
      err => {}
    );
  }

  showBasicAlert(msg){
    let alert = Alert.create({
      subTitle: msg,
      buttons: ['ok']
    });
    this.nav.present(alert);
  }

  salvar(outgoing: any){
    try{
      if(!outgoing.valid){
        let names: any = [];
        for(let item in outgoing.controls){
          if(!outgoing.controls[item].valid){
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
      this.OutgoingService.add(outgoing.value).subscribe((res) => {
        this.nav.pop();
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    }catch(e){
      this.loading = false;
    }
  }

}
