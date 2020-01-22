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
import { Routes, RouterModule, Router, NavigationStart } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { MainComponent } from './main/main.component';
import { RoutingInitService } from './service/routing-init.service';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes
  )],
  exports: [RouterModule]
})
export class AppRoutingModule {

  /**
   * Constructor
   * @param _router - Router
   * @param _routingInitService - RoutingInitService
   */
  constructor(
    private _router: Router,
    private _routingInitService: RoutingInitService
    ) {
      this._router.events.subscribe(async routerEvent => {
        if (routerEvent instanceof NavigationStart) {
          const url = routerEvent.url;
          const rx = /\/(.+?)\/.*/g;
          const view = rx.exec(url);
          if (
            null !== view
            && !(this._routingInitService.availableConfig.some(x => x === view[1]))
          ) {
            this._router.config.push(this._routingInitService.routeConfig(view[1]));
            this._router.setUpLocationChangeListener();
          }
        }
      }
    );
  }
}
