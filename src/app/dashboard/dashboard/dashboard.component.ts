import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import 'rxjs/Rx';

import { DashboardService } from './../dashboard.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

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
  hours: any[];
  currents: any[];
  powers: any[];
  envTemps: any[];
  sensorTemps: any[];
  power: number;
  anomaly: Boolean;

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
    private dashboardService: DashboardService,
    private errorHandler: ErrorHandlerService,
    private decimalPipe: DecimalPipe) {
    this.power = 0;
    this.anomaly = false;
  }

  ngOnInit() {
    this.getAndHandleData();
    setInterval(() => this.getAndHandleData(), this.interval);
  }

  handleChange(e) {
    this.getAndHandleData();
  }

  getAndHandleData() {
    this.dashboardService.getDataFromServer()
      .then(response => {
        this.sensors = response;
        this.updateLocalVars(this.sensors);
        this.setupLineGraph();
        this.setupLineGraph2();
        this.setupBarGraph();
      }).catch(erro => this.errorHandler.handle(erro));
  }


  updateLocalVars(response) {
    this.sensor = response[response.length - 1];
    this.power = this.sensor.voltage * this.sensor.current;
    this.hours = this.getHours(response);
    this.currents = this.getCurrents(response);
    this.powers = this.getPowers(response);
    this.sensorTemps = this.getSensorTemps(response);
    this.anomaly = !this.anomaly;
  }

  private setupLineGraph() {

    this.lineChartData = {
      labels: this.hours,
      datasets: [
        {
          label: 'Correntes [A]',
          data: this.currents,
          fill: true,
          borderColor: '#4bc0c0'
        },
        // {
        //     label: 'Esforço inst. [W/°C]',
        //     data: this.consumptions,
        //     fill: true,
        //     borderColor: '#333399'
        // }
      ]
    }
  }

  private setupLineGraph2() {

    this.lineChartData2 = {
      labels: this.hours,
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
      labels: this.hours,
      datasets: [
        {
          label: 'Diferencial de Temperaturas',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: this.powers
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
      yAxis.push(data[i].current.toFixed(3));
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

  private getPowers(data): any[] {
    const yAxis: any[] = [];
    for (let i = 0; i < data.length; i++) {
      yAxis.push(data[i].current * 220);
    }
    return yAxis;
  }

  private getHours(data) {
    const hours: string[] = [];
    for (let i = 0; i < data.length; i++) {
      hours.push(data[i].date.substr(1, 10));
    }
    return hours;
  }

  handleClick(event) {
    const csvData = this.ConvertToCSV(this.sensors);
    const blob = new Blob([csvData], { type: 'application/octet-stream' });
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

  getAnomaly():Boolean {
    return this.anomaly;

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
          line = line.replace('.', ',');
        }

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
