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
    this.configurarGraficoLinha();
    this.configurarGraficoPizza();
  }


  configurarGraficoPizza() {

    // DEBUG
    console.log('GRAFICO PIZZA');
    this.dashboardService.getDataFromMauaServer()
      .then(dados => {

        const horas = this.getHours(dados);
        this.sensor = dados[dados.length - 1];

        const temperaturas = this.getDeltaTemps(dados);

        this.pieChartData = {
          labels: ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h'],
            datasets: [
              {
                label: 'Temperaturas',
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                data: temperaturas
              }]
        }
      });
  }

  private configurarGraficoLinha() {
    // DEBUG
    console.log('GRAFICO LINHA');
    this.dashboardService.getDataFromMauaServer()
      .then(dados => {
        const horas = this.getHours(dados);
        console.log(horas);
        // diasDoMes = this.configurarDiasMes();
        // const totaisReceitas = this.totaisPorCadaDiaMes(
        //   dados.filter(dado => dado.tipo === 'RECEITA'), diasDoMes);
        // const totaisDespesas = this.totaisPorCadaDiaMes(
        //   dados.filter(dado => dado.tipo === 'DESPESA'), diasDoMes);


        const correntes = this.getCurrents(dados);

        const deltaTemperaturas = this.getDeltaTemps(dados);

        this.lineChartData = {
          labels: ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h'],
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
      });
  }

  private totaisPorCadaDiaMes(dados, diasDoMes) {
    const totais: number[] = [];
    for (const dia of diasDoMes) {
      let total = 0;

      for (const dado of dados) {
        if (dado.dia.getDate() === dia) {
          total = dado.total;

          break;
        }
      }

      totais.push(total);
    }

    return totais;
  }

  private configurarDiasMes() {
    // const mesReferencia = new Date();
    // mesReferencia.setMonth(mesReferencia.getMonth() + 1);
    // mesReferencia.setDate(0);

    const quantidade = 31;
    const dias: number[] = [];

    for (let i = 1; i <= quantidade; i++) {
      dias.push(i);
    }

    return dias;
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
      hours.push('item.date.hours:item.date.minute:item.date.second');
      console.log(item.prototype.getHours);
    }
    return hours;
  }
}
