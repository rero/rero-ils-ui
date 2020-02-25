import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  NavigationError
} from '@angular/router';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { RecordPermission, RecordPermissionService } from '../service/record-permission.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class CanUpdateGuard implements CanActivate {

  constructor(
    private _permissionService: RecordPermissionService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _router: Router) {
  }

  /**
   * Check if the current logged user can update a resource
   * @param next - ActivatedRouteSnapshot
   * @param state - RouterStateSnapshot
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this._permissionService.getPermission(next.params.type, next.params.pid).subscribe(
      (permission: RecordPermission) => {
        if (!permission.update.can) {
          this._router.navigate(['/errors/403'], { skipLocationChange: true });
        }
      }
    );
    return true;
  }

}
