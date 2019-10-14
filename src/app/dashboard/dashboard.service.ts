import { Injectable } from '@angular/core';

import 'rxjs/operator/toPromise';

import { environment } from './../../environments/environment';
import { ApiHttp } from '../seguranca/api-http';
import { Sensor } from '../core/model';

@Injectable()
export class DashboardService {

  lancamentosUrl: string;
  nodeUrl = 'https://iotserver8.herokuapp.com/dummydata' //'https://networkserver.maua.br/api/index.php/2b7e151628aed2a6abf7158809cf4f3c/';
  sensors: Sensor[];
  sensor: Sensor;
  number

  constructor(private http: ApiHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    this.sensors = [];
  }


  getDataFromServer(): Promise<any> {
    return this.http.get<any>(`${this.nodeUrl}`)
      .toPromise()
      .then(response => {
        return this.handleData(response);
      });
  }


  handleData(response): any {

    this.sensors = [];

    let counter = 0;

    console.log(response);

    for (let i = 0; i < response.length; i++) {

      let current = parseFloat(response[i].current);
      let voltage = parseFloat(response[i].voltage);
      let temperature = parseInt(response[i].temperature);
      let humidity = parseInt(response[i].humidity);
      let date = JSON.stringify(response[i].dateTime);

      this.sensor = new Sensor(current, voltage, temperature, humidity, date);
      this.sensors.push(this.sensor);
      counter++;
    }
    this.sensors = this.sensors.reverse();
    return this.sensors;
  }

} // end Class
