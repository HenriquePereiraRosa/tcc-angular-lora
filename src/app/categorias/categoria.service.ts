import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments/environment';
import { ApiHttp } from '../seguranca/api-http';

@Injectable()
export class CategoriaService {

  categoriasUrl: string;

  constructor(private http: ApiHttp) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.categoriasUrl)
      .toPromise();
  }

}
