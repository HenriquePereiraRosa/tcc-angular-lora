import { Injectable } from '@angular/core';

import 'rxjs/operator/toPromise';
import * as moment from 'moment';

import { environment } from './../../environments/environment';
import { ApiHttp } from '../seguranca/api-http';

@Injectable()
export class DashboardService {

  lancamentosUrl: string;
  nodeUrl: string;

  stringAux: String;
  nodes: Node[];
  node: Node;

  logs: string[];

  constructor(private http: ApiHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    this.nodeUrl = 'https://networkserver.maua.br/api/index.php/2b7e151628aed2a6abf7158809cf4f3c/10/0004a30b001e8b8e';
    this.logs = [];
    this.stringAux = '';
    this.nodes = [];
    // this.node = new Node();
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
    const manipulatedData = data.logs;

    console.log('0) Manipulated Data: ');
    console.log(manipulatedData);

    for (const item of manipulatedData) {
      console.log('In for loop...');
      console.log(item);
      console.log(item.data_payload);
      this.logs.push(item.data_payload);
      this.stringAux = JSON.stringify(item.data_payload).substring(0, 3);
      console.log(this.stringAux);
      // this.node.current = 0.0;
      // this.nodes.push(this.node);
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
