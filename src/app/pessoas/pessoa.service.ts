import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments/environment';
import { Pessoa, Estado, Cidade } from './../core/model';
import { ApiHttp } from '../seguranca/api-http';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class PessoaService {

  pessoasUrl: string;
  cidadesUrl: string;
  estadosUrl: string;

  constructor(private http: ApiHttp) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
    this.estadosUrl = `${environment.apiUrl}/estados`;
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http.get<any>(`${this.pessoasUrl}`, { params })
      .toPromise()
      .then(response => {
        const pessoas = response.content;
        // DEBUG
        console.log(`REPONSE: ${response}`);

        const resultado = {
          pessoas,
          total: response.totalElements
        };

        return resultado;
      })
  }

  listarTodas(): Promise<any> {
    return this.http.get<any>(this.pessoasUrl)
      .toPromise()
      .then(response => response.content);
  }

  excluir(id: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(id: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoasUrl}/${id}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post<Pessoa>(this.pessoasUrl, pessoa)
      .toPromise();
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.id}`, pessoa)
      .toPromise();
  }

  buscarPorid(id: number): Promise<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${id}`)
      .toPromise();
  }

  listarEstados(): Promise<Estado[]> {
    return this.http.get<Estado[]>(this.estadosUrl).toPromise();
  }

  pesquisarCidades(estado): Promise<Cidade[]> {
    const params = new HttpParams()
      .append('estado', estado);

    return this.http.get<Cidade[]>(this.cidadesUrl, {
      params
    }).toPromise();
  }

}
