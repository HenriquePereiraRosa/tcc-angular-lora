import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
                          : Observable<boolean> | Promise<boolean> | boolean {
    console.log('Navegação com access token inválido. Obtendo novo token...');
    return true;
  }

}
