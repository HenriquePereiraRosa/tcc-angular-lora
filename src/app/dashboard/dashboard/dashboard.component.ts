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

  interval = 50000;

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
    }

  ngOnInit() {
    setInterval(() => this.dashboardService.getDataFromMauaServer()
      .then(response => {
        this.configurarGraficoLinha(response);
        this.configurarGraficoPizza(response);
      }), this.interval);
  }


  configurarGraficoPizza(data) {

    const horas = this.getHours(data);
    this.sensor = data[data.length - 1];
    const deltaTemps = this.getDeltaTemps(data);
    // const consumptions = this.getConsumptions(dados);

    this.barChartData = 0;
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

  private configurarGraficoLinha(data) {

    const horas = this.getHours(data);
    const correntes = this.getCurrents(data);
    const consumptions = this.getConsumptions(data);

    this.lineChartData = 0;
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

  private getCurrents(data): any[] {
    const yAxis: any[] = [];
    for (const item of data) {
      yAxis.push(item.current);
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
      hours.push(item.date.substr(11, 8));
    }
    return hours;
  }

  public getAnomaly(): boolean {
    console.log(this.sensor.anomaly);
    return this.sensor.anomaly;
  }
}
