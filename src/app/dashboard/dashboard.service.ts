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

        for (const envTempItem of environmentTemp) {
          for (const item of dataAux.logs) {

            let stringAux = item.data_payload.substring(2, 6);
            current = parseInt(stringAux, 16);
            current -= 92;
            current = (current / (0.066 / (3.3 / 1024)));
            current = parseFloat(current.toFixed(3));

            stringAux = item.data_payload.substring(8, 12);
            temperature = parseInt(stringAux, 16) / 10;

            stringAux = item.data_payload.substring(14, 18);
            humidity = parseInt(stringAux, 16) / 10;

            stringAux = item.data_payload.substring(20, 24);
            vBat = parseInt(stringAux, 16) / 1000;

            date = item.created_at;

            const power = current * 220;
            const deltaTemp = envTempItem - temperature;
            if (deltaTemp) {
              consumption = power / (Math.abs(deltaTemp));
            } else {
              consumption = 0;
            }

            // DEBUG
            console.log(`POWER: ${power}`);
            console.log(`CURRENT: ${current}`);

            let irregularity = false;
            if (current > 5) {
              irregularity = true;
            }

            this.sensor = new Sensor(
              item.dev_eui, vBat, current, envTempItem, temperature, deltaTemp,
              humidity, consumption, irregularity, date);

          }
          this.sensors.push(this.sensor);
        }

        this.sensors = this.sensors.reverse();

        console.log(`Sensors:`);
        console.log(this.sensors);
        return this.sensors;
      });
  }

  handleEnvironmentTemp(data: any): any {
    const array: any[] = [0];
    for (const item of data.logs) {
      const stringAux = item.data_payload.substring(2, 6);
      const environmentTemp = parseInt(stringAux, 16) / 10;
      array.push(environmentTemp);
    }
    return array;
  }

} // end Class
