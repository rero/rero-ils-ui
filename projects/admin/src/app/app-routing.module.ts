/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { RouterModule, Routes } from '@angular/router';
import { PERMISSIONS } from '@rero/shared';
import { PermissionGuard } from './guard/permission.guard';
import { PermissionDetailViewComponent } from './record/detail-view/permission-detail-view/permission-detail-view.component';
import { RouteService } from './routes/route.service';
import { FrontpageComponent } from './widgets/frontpage/frontpage.component';

const routes: Routes = [
  {
    path: '',
    component: FrontpageComponent
  }, {
    path: 'circulation',
    loadChildren: () => import('./circulation/circulation.module').then(m => m.CirculationModule)
  }, {
    path: 'acquisition',
    loadChildren: () => import('./acquisition/acquisition.module').then(m => m.AcquisitionModule)
  },
  {
    path: 'permissions/matrix',
    component: PermissionDetailViewComponent,
    canActivate: [ PermissionGuard ], data: { permissions: [ PERMISSIONS.PERM_MANAGEMENT ] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private routeService: RouteService) {
    this.routeService.initializeRoutes();
  }
}
