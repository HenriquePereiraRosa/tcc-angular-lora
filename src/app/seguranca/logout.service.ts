import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';
import { ApiHttp } from './api-http';
import { Router } from '@angular/router';

@Injectable()
export class LogoutService {

  tokensRenokeUrl: string;

  constructor(
    private http: ApiHttp,
    private auth: AuthService,
    private router: Router
  ) {
    this.tokensRenokeUrl = `${environment.apiUrl}/token`;
  }

  logout() {
    return this.http.delete(this.tokensRenokeUrl, { withCredentials: true })
      .toPromise()
      .then(() => {
        this.auth.limparAccessToken();
        this.router.navigate(['/login']);
      });
  }

}
