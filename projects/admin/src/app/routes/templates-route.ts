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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActionStatus, DetailComponent, EditorComponent, JSONSchema7, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
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
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: EditorComponent, canActivate: [CanUpdateGuard] }
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _('Templates'),
            component: TemplatesBriefViewComponent,
            detailComponent: TemplateDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            canAdd: () => this._routeToolService.canNot(),
            permissions: (record: any) => this._routeToolService.permissions(record, this.recordType),
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
            sortOptions: [
              {
                label: _('Relevance'),
                value: 'bestmatch',
                defaultQuery: true
              },
              {
                label: _('Name'),
                value: 'name',
                defaultNoQuery: true
              }
            ],
            showFacetsIfNoResults: true
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
    const user = this._routeToolService.userService.user;
    if (!data.hasOwnProperty('visibility')) {
      data.visibility = 'private';
    }
    data.organisation = {
      $ref: this._routeToolService.apiService.getRefEndpoint('organisations', user.currentOrganisation)
    };
    data.creator = {
      $ref: this._routeToolService.apiService.getRefEndpoint('patrons', user.patronLibrarian.pid)
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
    const formWidget = jsonSchema.widget;
    if (formWidget?.formlyConfig?.templateOptions?.fieldMap === 'visibility') {
      if (!this._routeToolService.userService.user.isSystemLibrarian) {
        field.hooks = {
          ...field.hooks,
          afterContentInit: (f: FormlyFieldConfig) => {
            f.templateOptions.disabled = true;
          }
        };
      }
    }
    return field;
  }
}
