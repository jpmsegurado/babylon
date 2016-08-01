import {Component,ElementRef} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
import * as Chart from 'chart.js';

@Component({
  selector: 'chart',
  inputs:['incomes', 'outgoings', 'investiments', 'keepings', 'rest', 'fun'],
  templateUrl: 'build/components/chart/chart.html',
  directives: [IONIC_DIRECTIVES]
})
export class ChartComponent {

  private incomes: any;
  private outgoings: any;
  private investiments: any;
  private keepings: any;
  private rest: any;
  private chart: any;
  private fun: any;
  constructor(private element: ElementRef) {
    this.element = element;
  }

  ngOnInit(){
    setTimeout(() => {
      let ctx = this.element.nativeElement.querySelector("#chart").getContext('2d');
      let optionsPie = {
          tooltipEvents: [],
          showTooltips: false
      };
      let data = {
          labels: [],
          datasets: [
              {
                  data: [this.outgoings, this.keepings, this.investiments, this.fun ],
                  backgroundColor: [
                      "#E82C0C",
                      '#02E87E',
                      '#1C83E8',
                      '#FFBC10'
                  ]
              }]
      };

      this.chart = ctx != undefined && this.chart == null ? new Chart(ctx, {type: 'pie',data: data,animation:true}) : null;
    });
  }
}
