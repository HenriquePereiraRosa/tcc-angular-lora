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

  pieChartData: any;
  lineChartData: any;

  sensor: Sensor;
  data: any[];

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
    private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.dashboardService.getDataFromMauaServer()
      .then(response => {
        this.configurarGraficoLinha(response);
        this.configurarGraficoPizza(response);
      });
  }


  configurarGraficoPizza(dados) {

    const horas = this.getHours(dados);
    this.sensor = dados[dados.length - 1];
    const temperaturas = this.getDeltaTemps(dados);

    this.pieChartData = {
      labels: horas,
        datasets: [
          {
            label: 'Temperaturas',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            data: temperaturas
          }]
    }
  }

  private configurarGraficoLinha(dados) {

    const horas = this.getHours(dados);
    const correntes = this.getCurrents(dados);

    this.lineChartData = {
      labels: horas,
      datasets: [
          {
              label: 'Correntes',
              data: correntes,
              fill: true,
              borderColor: '#4bc0c0'
          },
          // {
          //     label: 'Temperaturas',
          //     data: temperaturas,
          //     fill: true,
          //     borderColor: '#565656'
          // }
      ]
    }
  }

  private getCurrents(dados): any[] {
    const yAxis: any[] = [];
    for (const item of dados) {
      yAxis.push(item.current);
    }
    return yAxis;
  }

  private getDeltaTemps(dados): any[] {
    const yAxis: any[] = [];
    for (const item of dados) {
      yAxis.push(item.deltaTemperature);
    }
    return yAxis;
  }

  private getHours(dados) {
    const hours: string[] = [];
    for (const item of dados) {
      hours.push(item.date.substr(11, 8));
    }
    return hours;
  }

  getAnomaly(): boolean {
    return this.sensor.anomaly;
  }
}
