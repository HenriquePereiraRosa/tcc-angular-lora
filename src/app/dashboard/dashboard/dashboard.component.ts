import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { DashboardService } from './../dashboard.service';
import { getCurrentQueries } from '@angular/core/src/render3/instructions';

import { Sensor } from '../../core/model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  barChartData: any;
  lineChartData: any;
  lineChartData2: any;
  requestNumber = 20;
  horas: any[];
  correntes: any[];
  consumptions: any[];
  envTemps: any[];
  sensorTemps: any[];
  deltaTemps: any[];
  consumptionCoef: number;

  interval = 1500000;
  sensor: Sensor;

  options = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const valor = dataset.data[tooltipItem.index];
          const label = dataset.label ? (dataset.label + ': ') : '';
          return label + this.decimalPipe.transform(valor, '1.2-2');
        }
      }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private decimalPipe: DecimalPipe) {
      this.requestNumber = 20;
      this.consumptionCoef = 0;
    }

  ngOnInit() {
    this.dashboardService.getDataFromMauaServer(this.requestNumber)
      .then(response => {
        this.updateLocalVars(response);
        this.setupLineGraph();
        this.setupLineGraph2();
        this.setupBarGraph();
        this.calcConsumptionCoef();
      });

    setInterval(() => this.dashboardService.getDataFromMauaServer(this.requestNumber)
      .then(response => {
        this.updateLocalVars(response);
        this.setupLineGraph();
        this.setupLineGraph2();
        this.setupBarGraph();
        this.calcConsumptionCoef();
      }), this.interval);
  }

  handleChange(e) {
    this.dashboardService.getDataFromMauaServer(this.requestNumber)
      .then(response => {
        this.updateLocalVars(response);
        this.setupLineGraph();
        this.setupLineGraph2();
        this.setupBarGraph();
      });
  }


  updateLocalVars(response) {
    this.sensor = response[response.length - 1];
    this.horas = this.getHours(response);
    this.correntes = this.getCurrents(response);
    this.consumptions = this.getConsumptions(response);
    this.envTemps = this.getEnvTemps(response);
    this.sensorTemps = this.getSensorTemps(response);
    this.deltaTemps = this.getDeltaTemps(response);
    this.calcConsumptionCoef();
  }

  calcConsumptionCoef() {
    let averageComsumption = 0;
    let averageDeltaTemp = 0;

    for (let i = 0; i < this.requestNumber; i++) {
      averageComsumption += this.consumptions[ i ];
      averageDeltaTemp += Math.abs(this.deltaTemps[ i ]);
    }
    averageComsumption /= this.consumptions.length;
    averageDeltaTemp /= this.deltaTemps.length;

    // if (averageDeltaTemp) {
      this.consumptionCoef = parseFloat((averageComsumption).toFixed(1)); // parseFloat((averageComsumption / averageDeltaTemp).toFixed(3));
    // } else {
    //   this.consumptionCoef = 0;
    // }
  }

  private setupLineGraph() {

    this.lineChartData = {
      labels: this.horas,
      datasets: [
          {
              label: 'Correntes [A]',
              data: this.correntes,
              fill: true,
              borderColor: '#4bc0c0'
          },
          {
              label: 'Consumo [W/°C]',
              data: this.consumptions,
              fill: true,
              borderColor: '#333399'
          }
      ]
    }
  }

  private setupLineGraph2() {

    this.lineChartData2 = {
      labels: this.horas,
      datasets: [
          {
              label: 'Ambiente Externo [°C]',
              data: this.envTemps,
              fill: true,
              borderColor: '#3e78c7'
          },
          {
              label: 'Ambiente Interno [°C]',
              data: this.sensorTemps,
              fill: true,
              borderColor: '#081242'
          }
      ]
    }
  }

  setupBarGraph() {

    this.barChartData = {
      labels: this.horas,
        datasets: [
          {
            label: 'Diferencial de Temperaturas',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            data: this.deltaTemps
          // },
          // {
          //   label: 'Consumo de Energia / Delta Temperatura [W/°C]',
          //   backgroundColor: '#42A5F5',
          //   borderColor: '#1E88E5',
          //   data: consumptions
          }]
    }
  }

  private getCurrents(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(parseFloat(data[ i ].current.toFixed(3)));
    }
    return yAxis;
  }

  private getEnvTemps(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[ i ].envTemp);
    }
    return yAxis;
  }

  private getSensorTemps(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[ i ].temperature);
    }
    return yAxis;
  }

  private getDeltaTemps(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[ i ].deltaTemp);
    }
    return yAxis;
  }

  private getConsumptions(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[ i ].consumption);
    }
    return yAxis;
}

  private getHours(data) {
    const hours: string[] = [];
    for (let i = 0; i < data.length; i++) {
      hours.push(data[ i ].date.substr(11, 5));
    }
    return hours;
  }

  public getAnomaly(): boolean {
    if (this.consumptionCoef > 2000) {
      return true;
    }
    return false;
  }
}
