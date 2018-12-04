import { Injectable } from '@angular/core';

import 'rxjs/operator/toPromise';
import * as moment from 'moment';

import { environment } from './../../environments/environment';
import { ApiHttp } from '../seguranca/api-http';
import { Sensor } from '../core/model';

@Injectable()
export class DashboardService {

  lancamentosUrl: string;
  nodeUrl = 'https://networkserver.maua.br/api/index.php/2b7e151628aed2a6abf7158809cf4f3c/';
  nodeEuiUrl = '/0004a30b001e8b8e';
  nodeEnvTempEuiURL = '/0004a30b001eb809';
  sensors: Sensor[];
  sensor: Sensor;
  number

  constructor(private http: ApiHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    this.sensors = [];
  }


  getDataFromMauaServer(requestNumber: number): Promise<any> {
    return this.http.get<any>(`${this.nodeUrl}${requestNumber}${this.nodeEnvTempEuiURL}`)
      .toPromise()
      .then(response => {
        const dados = response;
        return this.handleData(dados, requestNumber);
      });
  }


  handleData(response, requestNumber): any {
    return this.http.get<any>(`${this.nodeUrl}${requestNumber}${this.nodeEuiUrl}`)
      .toPromise()
      .then(responseArray => {
        const dataAux = responseArray;
        this.sensors = [];
        let consumption = 0;
        let current = 0;
        let temperature = 0;
        const environmentTemp = this.handleEnvironmentTemp(response);
        let humidity = 0;
        let vBat = 0;
        let date = '';

        let counter = 0;

        for (let i = 0; i < dataAux.logs.length; i++) {

          const envTempItem = environmentTemp[counter];

          current = parseInt(dataAux.logs[ i ].data_payload.substring(2, 6), 16);
          current -= 102;
          current = (current / (0.066 / (3.3 / 1024))) + 0.6;
          current = parseFloat(current.toFixed(3));

          temperature = parseInt(dataAux.logs[ i ].data_payload.substring(8, 12), 16) / 10;

          humidity = parseInt(dataAux.logs[ i ].data_payload.substring(14, 18), 16) / 10;

          vBat = parseInt(dataAux.logs[ i ].data_payload.substring(20, 24), 16) / 1000;

          date = dataAux.logs[ i ].created_at;

          const power = current * 220;
          const deltaTemp = envTempItem - temperature;

          if (deltaTemp) {
            consumption = power / (Math.abs(deltaTemp));
          } else {
            consumption = 0;
          }

          let irregularity = false;
          if (current > 5) {
            irregularity = true;
          }

          this.sensor = new Sensor(
            dataAux.logs[ i ].dev_eui, vBat, current, envTempItem, temperature, deltaTemp,
            humidity, consumption, irregularity, date);

          this.sensors.push(this.sensor);

          counter++;
        }

        this.sensors = this.sensors.reverse();
        // console.log(`Sensors: `);
        // console.log(this.sensors);
        return this.sensors;
      });
  }

  handleEnvironmentTemp(data: any): any {
    const array: any[] = [];
    for (let i = 0; i < data.logs.length; i++) {
      const environmentTemp = parseInt(data.logs[ i ].data_payload.substring(2, 6), 16) / 10;
      array.push(environmentTemp);
    }
    return array;
  }

} // end Class
