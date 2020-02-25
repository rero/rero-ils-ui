import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { LibraryGuard } from './library.guard';
import { Observable } from 'rxjs';
import { extractIdOnRef } from '@rero/ng-core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AcqOrderLineGuard extends LibraryGuard {

  /** Return the library linked to an acquisitin order number.
   *  @param route: the current URL route
   *  @return: the library pid linked to the resource from the 'order' query parameters
   */
  getOwningLibrary(route: ActivatedRouteSnapshot): Observable<string> {
    return this._recordService.getRecord('acq_orders', route.queryParams.order).pipe(
      map( data => data.metadata || {} ),
      map( metadata => metadata.library || {} ),
      map( library => extractIdOnRef(library.$ref) )
    );
  }

}
