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
    this.configurarGraficoPizza();
    this.configurarGraficoLinha();
  }

  configurarGraficoPizza() {
    this.dashboardService.getDataFromMauaServer()
      .then(dados => {

        this.sensor = dados[dados.length - 1];

        this.pieChartData = {
          labels: dados.map(dado => dado.temperature),
          datasets: [
            {
              data: dados.map(dado => dado.temperature),
              backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
                                  '#DD4477', '#3366CC', '#DC3912']
            }
          ]
        };
      });
  }

  configurarGraficoLinha() {
    this.dashboardService.getDataFromMauaServer()
      .then(dados => {
        const horas = dados.length; // diasDoMes = this.configurarDiasMes();
        // const totaisReceitas = this.totaisPorCadaDiaMes(
        //   dados.filter(dado => dado.tipo === 'RECEITA'), diasDoMes);
        // const totaisDespesas = this.totaisPorCadaDiaMes(
        //   dados.filter(dado => dado.tipo === 'DESPESA'), diasDoMes);

        console.log('Dados configurarGraficoLinha:')
        console.log(dados);

        const correntes = this.getCurrents(dados);
        const temperatures = this.getTemperatures(dados);

        this.lineChartData = {
          labels: horas,
          datasets: [
            {
              label: 'Corrente',
              data: correntes,
              borderColor: '#3366CC'
            }, {
              label: 'Temperatura',
              data: temperatures,
              borderColor: '#D62B00'
            }
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


  private getCurrents(dados) {
    const yAxis: number[] = [];
    for (const item of dados) {
      yAxis.push(item.current);
    }

    return yAxis;
  }

  private getTemperatures(dados) {
    const yAxis: number[] = [];
    for (const item of dados) {
      yAxis.push(item.temperature);
    }

    return yAxis;
  }
}
