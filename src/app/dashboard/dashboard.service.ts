import { Injectable } from '@angular/core';

import 'rxjs/operator/toPromise';
import * as moment from 'moment';

import { environment } from './../../environments/environment';
import { ApiHttp } from '../seguranca/api-http';

@Injectable()
export class DashboardService {

  lancamentosUrl: string;
  nodeUrl: string;

  logs: any[];

  constructor(private http: ApiHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    this.nodeUrl = 'https://networkserver.maua.br/api/index.php/2b7e151628aed2a6abf7158809cf4f3c/10/0004a30b001e8b8e';
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

        // DEBUG
        console.log(`DADOS: ${JSON.stringify(dados)}`);

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

        let dados = response;

        console.log(dados.forEach);

        for (let data of response) {
          console.log('In for loop...');
          console.log(JSON.parse(data));
          console.log(data.data_payload);
          this.logs.push(JSON.parse(data.data_payload));
        }
        // const dados = response[0].data_payload;

        // DEBUG
        // console.log(`DADOS: ${JSON.stringify(dados)}`);
        console.log(`1) DADOS:`);
        console.log(dados);
        console.log(`2) LOG'S:`);
        console.log(this.logs);

        // this.converterStringsParaDatas(dados);

        return dados;
      });
  }



} // end Class
