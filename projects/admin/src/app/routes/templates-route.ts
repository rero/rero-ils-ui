/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
 * Copyright (C) 2020 UCLouvain
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
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActionStatus, DetailComponent, EditorComponent, RecordSearchComponent, RouteInterface } from '@rero/ng-core';
import { JSONSchema7 } from 'json-schema';
import { Observable, Subscriber } from 'rxjs';
import { CanUpdateGuard } from '../guard/can-update.guard';
import { TemplatesBriefViewComponent } from '../record/brief-view/templates-brief-view.component';
import { TemplateDetailViewComponent } from '../record/detail-view/template-detail-view/template-detail-view.component';
import { BaseRoute } from './base-route';

export class TemplatesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'templates';

  /** Record type */
  readonly recordType = 'templates';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanUpdateGuard] }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Templates',
            component: TemplatesBriefViewComponent,
            detailComponent: TemplateDetailViewComponent,
            canAdd: () => this._routeToolService.canNot(),
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
            canUse: (record: any) => this._canUse(record),
            preCreateRecord: (data: any) => this._addDefaultValuesForTemplate(data),
            formFieldMap: (field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
              return this._limitUserFormField(field, jsonSchema);
            },
            redirectUrl: (record: any) => {
              return this.redirectUrl(
                record.metadata,
                '/records/templates/detail/'
              );
            },
            aggregationsOrder: [
              'type',
              'visibility'
            ],
            aggregationsExpand: [
              'type',
              'visibility'
            ],
            // use simple query for UI search
            preFilters: {
              simple: 1
            }
          }
        ]
      }
    };
  }

  /**
   * Eval if a template can be used to create a new resource. If yes, set the url to use to create this resource.
   * @param record: the record to check
   * @return Observable providing object with 2 attributes :
   *   - 'can' - Boolean: to know if the resource could be used
   *   - 'message' - String: the message to display if the record cannot be used
   *   - 'url' - String: the url to use thii template (optional)
   */
  private _canUse(record: any) {
    const usableTemplateTypes = ['documents', 'patrons'];
    return new Observable((observer: Subscriber<any>): void => {
      if (usableTemplateTypes.includes(record.metadata.template_type)) {
        this._routeToolService.canRead(record, this.recordType).subscribe((actionStatus: ActionStatus) => {
          if (actionStatus.can) {
            const urlTree = this._routeToolService.router.createUrlTree(
              ['/', 'records', record.metadata.template_type, 'new'],
              {
                queryParams: {
                  source: this.recordType,
                  pid: record.metadata.pid
                }
              }
            );
            const url = (this._routeToolService.urlSerializer.serialize(urlTree));
            actionStatus.url = url;
            observer.next(actionStatus);
          }
        });
      }
    });
  }

  /**
   * Adds default values when user create a template resource
   * @param data: the initial data
   */
  private _addDefaultValuesForTemplate(data: any) {
    const user = this._routeToolService.userService.getCurrentUser();
    if (!data.hasOwnProperty('visibility')) {
      data.visibility = 'private';
    }
    data.organisation = {
      $ref: this._routeToolService.apiService.getRefEndpoint('organisations', user.library.organisation.pid)
    };
    data.creator = {
      $ref: this._routeToolService.apiService.getRefEndpoint('patrons', user.pid)
    };
    return data;
  }

  /**
   * As a librarian, I cannot update the visibility of a template
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private _limitUserFormField(field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig {
    const formOptions = jsonSchema.form;
    if (formOptions && formOptions.fieldMap === 'visibility') {
      if (!this._routeToolService.userService.getCurrentUser().hasRole('system_librarian')) {
        field.templateOptions.disabled = true;
      }
    }
    return field;
  }
}
