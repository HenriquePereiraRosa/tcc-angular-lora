import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  user: string;
  password: string;

  constructor(private auth: AuthService,
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


  subscribe(email: string) {

    // DEBUG
    console.log(`EMAIL: ${email}`);
  }


}
