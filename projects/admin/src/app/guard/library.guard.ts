import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { RecordService } from '@rero/ng-core';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryGuard implements CanActivate {

  constructor(
    protected _recordService: RecordService,
    protected _userService: UserService,
    protected _router: Router
  ) {}

  /** Check if the current logged user is linked to the same library than the desired resource.
   *  If access is denied --> 403 : forbidden
   *  If error occcured --> 500 : Internal server error
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    combineLatest(
      this.getOwningLibrary$(next),
      this._userService.onUserLoaded$
    ).subscribe(
      ([owningLibrary, userMetadata ]) => {
        if (owningLibrary !== this._userService.getCurrentUser().getCurrentLibrary()) {
          this._router.navigate(['/errors/403'], { skipLocationChange: true });
        }
      },
      (error) => {
        this._router.navigate(['/errors/500'], { skipLocationChange: true });
      }
    );
    return true;
  }

  /** Return the library associated to the resource
   *  @param route: the current URL route
   *  @return the library pid linked to the resource from the 'library' query parameters
   */
  getOwningLibrary$(route: ActivatedRouteSnapshot): Observable<string> {
    return of(route.queryParams.library);
  }

}
