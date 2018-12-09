import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/Rx';

// import { ExportToCSV } from '@molteni/export-csv';

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
  averageComsumption: number;
  consumptionCoef: number;

  interval = 150000;
  sensor: Sensor;
  sensors: Sensor[];

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
    private sanitizer: DomSanitizer,
    private dashboardService: DashboardService,
    private decimalPipe: DecimalPipe) {
    this.requestNumber = 40;
    this.averageComsumption = 0;
    this.consumptionCoef = 0;
  }

  ngOnInit() {
    this.dashboardService.getDataFromMauaServer(this.requestNumber)
      .then(response => {
        this.sensors = response;
        this.updateLocalVars(this.sensors);
        this.setupLineGraph();
        this.setupLineGraph2();
        this.setupBarGraph();
        this.calcConsumptionCoef();
      });

    setInterval(() => this.dashboardService.getDataFromMauaServer(this.requestNumber)
      .then(response => {
        this.sensors = response;
        this.updateLocalVars(this.sensors);
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
    this.averageComsumption = 0;
    let averageDeltaTemp = 0;
    const date = new Date;

    for (let i = 0; i < this.consumptions.length; i++) {
      this.averageComsumption += this.consumptions[i];
      averageDeltaTemp += Math.abs(this.deltaTemps[i]);
    }
    this.averageComsumption /= this.consumptions.length;
    averageDeltaTemp /= this.deltaTemps.length;

    // if (averageDeltaTemp) {
    // parseFloat((averageComsumption / averageDeltaTemp).toFixed(3));
    // } else {
    //   this.consumptionCoef = 0;
    // }
    this.averageComsumption = parseFloat((this.averageComsumption).toFixed(2));

    this.consumptionCoef = this.averageComsumption / (averageDeltaTemp + 1);

    // console .log(`Avg Consumption: ${this.averageComsumption}`);
    // console .log(`Avg Delta Temp: ${averageDeltaTemp}`);
    // console.log(date.toTimeString());
    console.log(this.consumptionCoef);

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
        // {
        //     label: 'Consumo [W/°C]',
        //     data: this.consumptions,
        //     fill: true,
        //     borderColor: '#333399'
        // }
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
      yAxis.push(parseFloat(data[i].current.toFixed(3)));
    }
    return yAxis;
  }

  private getEnvTemps(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[i].envTemp);
    }
    return yAxis;
  }

  private getSensorTemps(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[i].temperature);
    }
    return yAxis;
  }

  private getDeltaTemps(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[i].deltaTemp);
    }
    return yAxis;
  }

  private getConsumptions(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[i].consumption);
    }
    return yAxis;
  }

  private getHours(data) {
    const hours: string[] = [];
    for (let i = 0; i < data.length; i++) {
      hours.push(data[i].date.substr(11, 5));
    }
    return hours;
  }

  public getAnomaly(): boolean {
    if (this.consumptionCoef > 200) {
      return true;
    }
    return false;
  }

  handleClick(event) {
    // const exporter = new ExportToCSV();
    const columns = ['consumption', 'current', 'date',
      'deltaTemp', 'dev_eui', 'envTemp', 'humidity',
      'temperature', 'vBat'];

    // exporter.exportColumnsToCSV(this.sensors, 'data', columns);

    console.log(this.sensors);

    const csvData = this.ConvertToCSV(this.sensors);
    const blob = new Blob([csvData], { type: 'application/octet-stream' });
    console.log(csvData);
    console.log('start download:');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = 'data.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  ConvertToCSV(objArray: any): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';

    // tslint:disable-next-line:forin
    for (const index in objArray[0]) {
      // Now convert each value to string and comma-separated
      row += index + '|';
    }
    row = row.slice(0, -1);
    // append Label row with line break
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      // tslint:disable-next-line:forin
      for (const index in array[i]) {
        if (line !== '') {
          line += '|';
          // line = line.replace('.', ',');
        }

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
