import { Component, NgZone, ElementRef } from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common' ;
import { NavController, Platform, Alert, NavParams } from 'ionic-angular';
import { DatePicker } from 'ionic-native';
import { Outgoing } from '../../providers/outgoing/outgoing';
import moment from '../../providers/moment/moment';
import * as _ from 'lodash';
import VMasker from '../../providers/vmasker/vmasker';

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
  private valor: any;
  private data: any;
  private parcelas: any;
  private loading: any = false;
  private deleting: any = false;
  constructor(
    private nav: NavController,
    private platform: Platform,
    private params: NavParams,
    private OutgoingService: Outgoing,
    private zone: NgZone,
    private fb: FormBuilder,
    private el: ElementRef
  ) {

    if(!params.get('outgoing')){
      this.outgoing = new ControlGroup({
        descricao: new Control('', Validators.required),
        valor: new Control('', Validators.required),
        data: new Control(moment().toISOString(), Validators.required),
        tipo: new Control('0', Validators.required)
      });
    }else{
      let outgoing = params.get('outgoing');
      console.log(outgoing);
      let valor = VMasker.toMoney(outgoing.valor, {
        precision: 2,
        separator: ',',
        unit: 'R$'
      });
      this.outgoing = new ControlGroup({
        descricao: new Control(outgoing.descricao, Validators.required),
        valor: new Control('', Validators.required),
        data: new Control(moment(outgoing.data, 'YYYY-MM-DD').toISOString(), Validators.required),
        tipo: new Control(outgoing.tipo, Validators.required)
      });

      setTimeout(() => {
        this.outgoing.controls.valor.updateValue(valor);
      });
    }
  }

  onChange(e){

  }

  ngOnInit(){
    VMasker(this.el.nativeElement.querySelector('.valor input')).maskMoney({
      precision: 2,
      separator: ',',
      unit: 'R$'
    });
  }

  moment(data){
    return moment(data);
  }

  pickDate(data){
    console.log(window['cordova']);
    if(!window['cordova']){
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

  getDia(data){
    return moment(data).format('DD');
  }

  deletar(){
    let outgoing = this.params.get('outgoing');
    let alert = Alert.create({
      subTitle: `Deseja deletar ${outgoing.descricao}?`,
      buttons: [{
        text: 'sim',
        handler: () => {
          console.log(outgoing);
          this.deleting = true;
          this.OutgoingService.deleteOnline(outgoing).subscribe(() => {
            this.OutgoingService.deletePouch(outgoing).subscribe(() => {
              this.nav.pop();
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

  showBasicAlert(msg){
    let alert = Alert.create({
      subTitle: msg,
      buttons: ['ok']
    });
    this.nav.present(alert);
  }

  salvar(outgoing: any){
    console.log(outgoing);
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

      if(outgoing.value.tipo == '7'){
        let data = moment(outgoing.data).add(this.parcelas, 'M');
        outgoing.value.data_final = data.toISOString();
        outgoing.value.parcelas = this.parcelas;
        console.log(outgoing.value);
      }

      this.loading = true;
      if(!this.params.get('outgoing')){
        outgoing.value.valor = (parseFloat(outgoing.value.valor.slice(3, outgoing.value.valor.length).replace(',', '.')) * 10).toFixed(2);
        this.OutgoingService.add(outgoing.value).subscribe((res) => {
          this.nav.pop();
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }else{
        if(!!outgoing.controls.valor.dirty){
          outgoing.value.valor = (parseFloat(outgoing.value.valor.slice(3, outgoing.value.valor.length).replace(',', '.')) * 10).toFixed(2);
        }else{
          outgoing.value.valor = (parseFloat(outgoing.value.valor.slice(3, outgoing.value.valor.length).replace(',', '.'))).toFixed(2);
        }
        let obj = _.extend(outgoing.value);
        obj.key = this.params.get('outgoing').key;
        obj._id = this.params.get('outgoing')._id;
        obj._rev = this.params.get('outgoing')._rev;
        console.log(obj);
        console.log(this.params.get('outgoing'));
        this.OutgoingService.update(outgoing.value).subscribe((res) => {
          this.nav.pop();
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }
    }catch(e){
      this.loading = false;
      console.log(e);
    }
  }

}
