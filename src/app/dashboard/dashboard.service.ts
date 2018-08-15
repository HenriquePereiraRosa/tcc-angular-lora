import { Injectable } from '@angular/core';

import 'rxjs/operator/toPromise';
import * as moment from 'moment';

import { environment } from './../../environments/environment';
import { ApiHttp } from '../seguranca/api-http';
import { Sensor } from '../core/model';

@Injectable()
export class DashboardService {

  lancamentosUrl: string;
  nodeUrl: string;

  sensors: Sensor[];
  sensor: Sensor;

  constructor(private http: ApiHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    this.nodeUrl = 'https://networkserver.maua.br/api/index.php/2b7e151628aed2a6abf7158809cf4f3c/10/0004a30b001e8b8e';
    this.sensors = [];
  }

  lancamentosPorCategoria(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-categoria`)
      .toPromise();
  }

  lancamentosPorDia(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-dia`)
      .toPromise()
      .then(response => {
        const dados = response;
        this.converterStringsParaDatas(dados);
        return dados;
      });
  }

  private converterStringsParaDatas(dados: Array<any>) {
    for (const dado of dados) {
      dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
    }
  }


  getDataFromMauaServer(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.nodeUrl}`)
      .toPromise()
      .then(response => {

        let dados = response;
        dados = this.handleData(dados);
        return dados;
      });
  }

  handleData(data: any): any {
    let current = 0;
    let temperature = 0;
    let humidity = 0;
    let vBat = 0;
    const dataAux = data.logs;

    for (const item of dataAux) {
      let stringAux = item.data_payload.substring(2, 6);
      current = parseInt(stringAux, 16);
      current -= 102;
      current = (current / (0.066 / (3.3 / 1024)));

      stringAux = item.data_payload.substring(8, 12);
      temperature = parseInt(stringAux, 16) / 10;

      stringAux = item.data_payload.substring(14, 18);
      humidity = parseInt(stringAux, 16) / 10;

      stringAux = item.data_payload.substring(20, 24);
      vBat = parseInt(stringAux, 16) / 1000;

      const power = current * 220;

       let irregularity = false;
      if (current > 5) {
        irregularity = true;
      }

      this.sensor = new Sensor(
        item.dev_eui, vBat, current, temperature,
        humidity, power, irregularity);

      this.sensors.push(this.sensor);
    }

    console.log(`Sensors:`);
    console.log(this.sensors);
    return this.sensors;
  }



} // end Class
