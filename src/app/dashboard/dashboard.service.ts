import { Injectable } from '@angular/core';

import 'rxjs/operator/toPromise';
import * as moment from 'moment';

import { environment } from './../../environments/environment';
import { ApiHttp } from '../seguranca/api-http';

@Injectable()
export class DashboardService {

  lancamentosUrl: string;
  nodeUrl: string;

  nodes: Node[];
  node: Node;

  logs: string[];

  constructor(private http: ApiHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    this.nodeUrl = 'https://networkserver.maua.br/api/index.php/2b7e151628aed2a6abf7158809cf4f3c/10/0004a30b001e8b8e';
    this.logs = [];
    this.nodes = [];
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
        console.log(response);
        console.log('Antes da manipulação do payload!');

        const dados = response;

        this.manipulateData(dados);
        // console.log('0) Dados: ');
        // console.log(dados);

        // for (const data of dados.logs) {
        //   console.log('In for loop...');
        //   console.log(data);
        //   console.log(data.data_payload);
        //   this.logs.push(data.data_payload);
        //   this.stringAux = JSON.stringify(data.data_payload).substring(0, 3);
        //   console.log(this.stringAux);
        //   // this.node.current = 0.0;
        //   this.nodes.push(this.node);
        // }
        // // const dados = response[0].data_payload;

        // // DEBUG
        // // console.log(`DADOS: ${JSON.stringify(dados)}`);
        // console.log(`1) DADOS:`);
        // console.log(dados);
        // console.log(`2) LOG'S:`);
        // console.log(this.logs);

        // // this.converterStringsParaDatas(dados);

        return this.logs;
      });
  }

  manipulateData(data: any): any {
    let current = 0;
    let temperature = 0;
    let humidity = 0;
    let vBat = 0;
    const manipulatedData = data.logs;

    console.log('0) Manipulated Data: ');
    console.log(manipulatedData);

    for (const item of manipulatedData) {
      console.log('In for loop...');
      console.log(item);
      console.log(item.data_payload);
      this.logs.push(item.data_payload);
      let stringAux = item.data_payload.substring(2, 6);
      current = parseInt(stringAux, 16);
      current -= 102;
      current = (current / (0.066 / (3.3 / 1024)));
      console.log('Current:');
      console.log(stringAux);
      console.log(current);

      stringAux = item.data_payload.substring(8, 12);
      temperature = parseInt(stringAux, 16) / 10;
      console.log('Temperature:');
      console.log(stringAux);
      console.log(temperature);

      stringAux = item.data_payload.substring(14, 18);
      humidity = parseInt(stringAux, 16) / 10;
      console.log('Humidity:');
      console.log(stringAux);
      console.log(humidity);

      stringAux = item.data_payload.substring(20, 24);
      vBat = parseInt(stringAux, 16) / 1000;
      console.log('Battery Voltage:');
      console.log(stringAux);
      console.log(vBat);

      this.node = new Node(
        item.dev_eui);
    }
    // const dados = response[0].data_payload;

    // DEBUG
    // console.log(`DADOS: ${JSON.stringify(dados)}`);
    console.log(`1) Manipulated DATA:`);
    console.log(manipulatedData);
    console.log(`2) LOG'S:`);
    console.log(this.logs);
    return manipulatedData;
  }



} // end Class
