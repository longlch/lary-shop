import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.user$.pipe(
      map(user => {
        console.log('[AuthGuardService][canActivate()]{user:}', user);
        if (user) {
          return true;
        }
        this.router.navigate(['/login'],
          {queryParams : {returnUrl: state.url}
        });
      })
    );
  }

}
