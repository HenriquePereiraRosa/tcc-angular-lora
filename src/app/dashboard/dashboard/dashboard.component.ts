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

  const interval = 10000;

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
    private decimalPipe: DecimalPipe) {
    }

  ngOnInit() {
    setInterval(this.dashboardService.getDataFromMauaServer()
      .then(response => {
        this.configurarGraficoLinha(response);
        this.configurarGraficoPizza(response);
      });, interval);
  }


  configurarGraficoPizza(dados) {

    const horas = this.getHours(dados);
    this.sensor = dados[dados.length - 1];
    const deltaTemps = this.getDeltaTemps(dados);
    // const consumptions = this.getConsumptions(dados);

    this.barChartData = {
      labels: horas,
        datasets: [
          {
            label: 'Diferencial de Temperaturas',
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            data: deltaTemps
          // },
          // {
          //   label: 'Consumo de Energia / Delta Temperatura [W/°C]',
          //   backgroundColor: '#42A5F5',
          //   borderColor: '#1E88E5',
          //   data: consumptions
          }]
    }
  }

  private configurarGraficoLinha(dados) {

    const horas = this.getHours(dados);
    const correntes = this.getCurrents(dados);
    const consumptions = this.getConsumptions(dados);

    this.lineChartData = {
      labels: horas,
      datasets: [
          {
              label: 'Correntes',
              data: correntes,
              fill: true,
              borderColor: '#4bc0c0'
          },
          {
              label: 'Consumo [W/°C]',
              data: consumptions,
              fill: true,
              borderColor: '#565656'
          }
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
      yAxis.push(item.deltaTemp);
    }
    return yAxis;
  }

  private getConsumptions(dados): any[] {
    const yAxis: any[] = [];
    for (const item of dados) {
      yAxis.push(item.consumption);
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

  public getAnomaly(): boolean {
    console.log(this.sensor.anomaly);
    return this.sensor.anomaly;
  }
}
