/*
* RERO ILS UI
* Copyright (C) 2019 RERO
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, version 3 of the License.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { NgModule } from '@angular/core';
import { NavigationStart, Router, RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './error/error-page.component';
import { MainComponent } from './main/main.component';
import { CollectionsRouteService } from './routes/collections-route.service';
import { DocumentsRouteService } from './routes/documents-route.service';
import { resourceRouteToken } from './routes/route-collection.service';
import { RouteFactoryService } from './routes/route-factory.service';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    pathMatch: 'full'
  },
  { path: 'errors/:status_code', component: ErrorPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [RouterModule],
  providers: [
    // Use the "multi" parameter to allow the recovery of several services in the injector.
    { provide: resourceRouteToken, useClass: DocumentsRouteService, multi: true },
    { provide: resourceRouteToken, useClass: CollectionsRouteService, multi: true },
  ]
})
export class AppRoutingModule {

  /**
   * Constructor
   * @param _router - Router
   * @param _routeFactoryService - RouteFactoryService
   */
  constructor(
    private _router: Router,
    private _routeFactoryService: RouteFactoryService
    ) {
      this._router.events.subscribe(async routerEvent => {
        if (routerEvent instanceof NavigationStart) {
          let url = routerEvent.url;
          const position = url.indexOf('?');
          if (position > -1) {
            /* Remove parameters after ? */
            url = url.substr(0, position);
          }
          /* Clean empty values */
          const urlParams = url.split('/').filter(param => param);
          if (urlParams.length === 3) {
            const view = urlParams[0];
            const resource = urlParams[2];
            if (view && resource) {
              this._routeFactoryService.createRouteByRecourceNameAndView(
                resource,
                view
              );
            }
          }
        }
      }
    );
  }
}
