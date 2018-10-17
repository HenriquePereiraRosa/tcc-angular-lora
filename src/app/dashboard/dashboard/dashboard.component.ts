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
  requestNumber = 20;
  horas: any[];
  correntes: any[];
  consumptions: any[];
  deltaTemps: any[];
  consumptionCoef: number;

  interval = 30000;
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
        this.setupBarGraph();
        this.calcConsumptionCoef();
      });

    setInterval(() => this.dashboardService.getDataFromMauaServer(this.requestNumber)
      .then(response => {
        this.updateLocalVars(response);
        this.setupLineGraph();
        this.setupBarGraph();
        this.calcConsumptionCoef();
      }), this.interval);
  }

  handleChange(e) {
    this.dashboardService.getDataFromMauaServer(this.requestNumber)
      .then(response => {
        this.updateLocalVars(response);
        this.setupLineGraph();
        this.setupBarGraph();
      });
  }


  updateLocalVars(response) {
    this.sensor = response[response.length - 1];
    this.horas = this.getHours(response);
    this.correntes = this.getCurrents(response);
    this.consumptions = this.getConsumptions(response);
    this.deltaTemps = this.getDeltaTemps(response);
  }

  calcConsumptionCoef() {
    let averageComsumption = 0;
    let averageDeltaTemp = 0;
    let i = 0;
    for (; i < this.consumptions.length; i++) {
      averageComsumption += this.consumptions[i];
      averageDeltaTemp += this.deltaTemps[i];
    }
    averageComsumption /= i;
    averageDeltaTemp /= i;

    console.log(`CONSUMO Médio: ${averageComsumption}`);
    console.log(`Delta Temperatura Média: ${averageDeltaTemp}`);

    this.consumptionCoef = parseFloat((averageComsumption / averageDeltaTemp).toFixed(3));
  }

  private setupLineGraph() {

    this.lineChartData = {
      labels: this.horas,
      datasets: [
          {
              label: 'Correntes',
              data: this.correntes,
              fill: true,
              borderColor: '#4bc0c0'
          },
          {
              label: 'Consumo [W/°C]',
              data: this.consumptions,
              fill: true,
              borderColor: '#565656'
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
    for (const item of data) {
      yAxis.push(parseFloat(item.current.toFixed(3)));
    }
    return yAxis;
  }

  private getDeltaTemps(data): any[] {
    const yAxis: any[] = [];
    for (const item of data) {
      yAxis.push(item.deltaTemp);
    }
    return yAxis;
  }

  private getConsumptions(data): any[] {
    const yAxis: any[] = [];
    for (const item of data) {
      yAxis.push(item.consumption);
    }
    return yAxis;
}

  private getHours(data) {
    const hours: string[] = [];
    for (const item of data) {
      hours.push(item.date.substr(11, 5));
    }
    return hours;
  }

  public getAnomaly(): boolean {
    console.log(this.sensor.anomaly);
    return this.sensor.anomaly;
  }
}
