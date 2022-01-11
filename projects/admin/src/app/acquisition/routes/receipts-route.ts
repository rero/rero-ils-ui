/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DetailComponent, EditorComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { BaseRoute } from '../../routes/base-route';
import { ReceiptDetailViewComponent } from '../components/receipt/receipt-detail-view/receipt-detail-view.component';

export class ReceiptsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_receipts';
  /** Record type */
  readonly recordType = 'acq_receipts';

  /** Get route configuration */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent},
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Receipts'),
            detailComponent: ReceiptDetailViewComponent,
            editorSettings: {
              longMode: true,
            },
            searchFilters: [
              this.expertSearchFilter()
            ],
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType, true),
            preUpdateRecord: (data: any) => this._cleanRecord(data),
            aggregations: (aggregations: any) => this._routeToolService.aggregationFilter(aggregations),
            aggregationsBucketSize: 10,
            itemHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            listHeaders: {
              Accept: 'application/rero+json'
            }
          }
        ]
      }
    };
  }

  /**
   * Remove some fields from model. These field are added to record during
   * dumping but are not present into the `Order` JSON schema.
   * @param data: the data to update
   * @return: the cleaned data
   */
  private _cleanRecord(data: any): any {
    // remove dynamic fields
    // TODO :: remove dynamic key....
    return data;
  }

}
