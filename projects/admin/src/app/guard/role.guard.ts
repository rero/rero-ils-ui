import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
/** This guard check if the current logged user has a specific role. The roles to check should be passed
 *  using path.data.roles (see below). You can provide multiple roles ; the guard check if the user has at
 *  least one of this role (OR condition).
 *
 *  USAGE:
 *  { path: 'new',
 *    component: MyComponent,
 *    canActivate: [RoleGuard],
 *    data: {
 *      roles: ['xxx', 'yyy'],
 *      operator: 'and' || 'or'  # 'and' by default
 *    }
 *  }
 */
export class RoleGuard implements CanActivate {

  constructor(
    private _userService: UserService,
    private _router: Router
  ) { }

  /** Check if the current logged user as at least a specific role */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this._userService.onUserLoaded$.subscribe(() => {
      if (!this._userService.getCurrentUser().hasRoles(next.data.roles as Array<string>, next.data.operator || 'and')) {
        this._router.navigate(['/errors/403'], { skipLocationChange: true });
      }
    });
    return true;
  }

}
