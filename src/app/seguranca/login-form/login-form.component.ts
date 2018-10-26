import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';

import { HttpHeaders } from '@angular/common/http';
import { ApiHttp } from '../api-http';
import { Email } from 'app/core/model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  user: string;
  password: string;

  emailsUrl = 'https://tcc-email-server.herokuapp.com/emails'

  constructor(
    private http: ApiHttp,
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router) {
      this.user = 'admin@server.com';
      this.password = 'admin';
     }

  login(user: string, senha: string) {
    this.auth.login(user, senha)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }


  subscribe(email: Email): Promise<any> {
      const headers = new Headers();
      // headers.append('Authorization', 'Basic YW5ndWxhcjphbmd1bGFy');
      headers.append('Content-Type', 'application/json');

      return this.http.post(this.emailsUrl,
          JSON.stringify(email), { headers })
        .toPromise()
        .then(response => console.log(response));
    }

}
