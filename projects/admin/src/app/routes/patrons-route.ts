// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { _ } from '@ngx-translate/core';
import {
  ActionStatus,
  ComponentCanDeactivateGuard,
  EditorComponent,
  IFilter,
  JSONSchema7,
  RecordData,
  RecordSearchPageComponent,
  RecordService,
  RecordType,
  RouteDataTypesInterface
} from '@rero/ng-core';
import { ILibrary, IPatron, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from '../guard/can-access.guard';
import { permissionGuard } from '../guard/permission.guard';
import { PatronsBriefViewComponent } from '../record/brief-view/patrons-brief-view/patrons-brief-view.component';
import { PatronDetailViewComponent } from '../record/detail-view/patron-detail-view/patron-detail-view.component';
import { PatronDetailComponent } from '../record/detail-view/patron-detail-view/patron-detail/patron-detail.component';
import { BaseRoute } from './base-route';

export const patronsRouteResolver: ResolveFn<Partial<RecordType>[]> = () =>
  new PatronsRoute().getTypes();

export const patronsRoutes: Routes = [
  {
    path: '',
    component: RecordSearchPageComponent,
    title: _('Patrons'),
    canActivate: [permissionGuard],
    data: {
      permissions: [PERMISSIONS.PTRN_ACCESS, PERMISSIONS.PTRN_SEARCH],
      operator: PERMISSION_OPERATOR.AND,
    },
  },
  {
    path: 'detail/:pid',
    component: PatronDetailComponent,
    title: _('Patron'),
    canActivate: [canAccessGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.READ,
    },
  },
  {
    path: 'edit/:pid',
    component: EditorComponent,
    title: _('Patron'),
    canActivate: [canAccessGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      action: CAN_ACCESS_ACTIONS.UPDATE,
    },
  },
  {
    path: 'new',
    component: EditorComponent,
    title: _('Patron'),
    canActivate: [permissionGuard],
    canDeactivate: [ComponentCanDeactivateGuard],
    data: {
      permissions: [PERMISSIONS.PTRN_CREATE],
    },
  },
];

class PatronsRoute extends BaseRoute implements RouteDataTypesInterface {
  protected recordService = inject(RecordService);

  /** Route name */
  readonly name = 'patrons';

  /** Record type */
  readonly recordType = 'patrons';

  getTypes(): Partial<RecordType>[] {
    return [
      {
        key: this.name,
        label: _('Users'),
        editorSettings: {
          template: {
            recordType: 'templates',
            loadFromTemplate: true,
            saveAsTemplate: true,
          },
        },
        component: PatronsBriefViewComponent,
        detailComponent: PatronDetailViewComponent,
        searchFilters: [
          this.expertSearchFilter(),
          {
            label: 'Show only:',
            filters: [
              {
                label: _('Expired'),
                filter: 'expired',
                value: 'true',
                showIfQuery: true,
              },
              {
                label: _('Not expired'),
                filter: 'not_expired',
                value: 'true',
                showIfQuery: true,
              },
              {
                label: _('Blocked'),
                filter: 'blocked',
                value: 'true',
                showIfQuery: true,
              },
            ],
          },
        ],
        canAdd: () => of({ can: this.routeToolService.appStore.canAccess(PERMISSIONS.PTRN_CREATE) } as ActionStatus),
        permissions: (record: RecordData) => this.routeToolService.permissions(record, this.recordType),
        processFilterName: (filter: IFilter) => this.processFilterName(filter),
        canUpdate: (record: RecordData) => this.routeToolService.canUpdate(record, this.recordType),
        canDelete: (record: RecordData) => this.routeToolService.canDelete(record, this.recordType),
        preprocessRecordEditor: (record: any) => {
          // set the patron expiration to now + 3 years if does not exists
          const defaultExpDate = new Date();
          defaultExpDate.setFullYear(defaultExpDate.getFullYear() + 3);
          record = {
            patron: {
              expiration_date: this.routeToolService.datePipe.transform(defaultExpDate, 'yyyy-MM-dd'),
            },
            ...record,
          };
          return record;
        },
        postprocessRecordEditor: (record: any) => {
          // Clean-up 'blocked_note' field content if blocked is false.
          if (record.blocked === false) {
            delete record.blocked_note;
          }
          // Clean-up 'patron' data from record if the patron doesn't have the 'patron' role
          if (!record.roles.includes('patron') && 'patron' in record) {
            delete record.patron;
          }
          return record;
        },
        formFieldMap: ((field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig => {
          if (field.props.label === 'Role' && field.asyncValidators == null) {
            field.asyncValidators = {};
          }
          return this._limitUserFormField(field, jsonSchema);
        }) as any,
        aggregationsExpand: ['roles', 'city', 'patron_type'],
        aggregationsOrder: ['roles', 'city', 'patron_type'],
        allowEmptySearch: false,
        listHeaders: {
          Accept: 'application/rero+json',
        },
        sortOptions: [
          {
            label: _('Relevance'),
            value: 'bestmatch',
            defaultQuery: true,
            defaultNoQuery: true,
            icon: 'fa fa-sort-amount-desc',
          },
          {
            label: _('Name'),
            value: 'full_name',
            icon: 'fa fa-sort-alpha-asc',
          },
        ],
        showFacetsIfNoResults: true,
      },
    ];
  }

  /** Limit some field from user editor.
   *
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private _limitUserFormField(field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig {
    // ROLES FIELD MANAGEMENT ---------------------------------
    //   Depending of current user, the roles user can managed could be restricted.
    //   Call the 'role_management' API filter allowed roles. If user cannot manage a role, then this role
    //   will be disabled.  We can't hide the restricted role because if the edited user has already this role
    //   this information will be lost on save !
    const formWidget = jsonSchema.widget;
    if (formWidget?.formlyConfig?.props?.fieldMap === 'roles') {
      const values = Object.assign([], field.props.options); // create a clone of original values
      field.props.options = this.routeToolService.recordPermissionService.getRolesManagementPermissions().pipe(
        map((results: any) => {
          values.forEach((role: any) => (role.disabled = !results.allowed_roles.includes(role.value)));
          return values;
        })
      );
    }

    // LIBRARY MANAGEMENT -------------------------------------
    //   If current logged user doesn't have the 'system_librarian' role, then the only library available
    //   should be the current_user.current_library. Set default value for library select the current_library URI
    //   and disable the field (so the user can't change/manage other libraries)
    if (formWidget?.formlyConfig?.props?.fieldMap === 'libraries') {
      field.type = 'select';
      field.hooks = {
        ...field.hooks,
        afterContentInit: (f: FormlyFieldConfig) => {
          const user = this.routeToolService.appStore.user();
          const apiService: any = this.routeToolService.apiService;
          const recordService: RecordService = this.routeToolService.recordService as RecordService;

          // Extract libraries from patron > libraries
          const libraries = [];
          user?.patrons.map((patron: IPatron) => {
            patron.libraries.map((library: ILibrary) => {
              libraries.push(library.pid);
            });
          });

          f.props.options = recordService
            .getRecords('libraries', {
              query: `pid:${libraries.join(' OR pid:')}`,
              page: 1,
              itemsPerPage: RecordService.MAX_REST_RESULTS_SIZE,
              sort: 'name',
            })
            .pipe(
              map((result: any) => (+recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits)),
              map((hits: any) => {
                return hits.map((hit: any) => {
                  return {
                    label: hit.metadata.name,
                    value: apiService.getRefEndpoint('libraries', hit.metadata.pid),
                  };
                });
              })
            );
        },
      };
    }
    return field;
  }

  private processFilterName(filter: IFilter): Observable<string> {
    if(filter.name) { return of(filter.name); }
    switch (filter.aggregationKey) {
      case 'patron_type': return this.recordService.getRecord<{metadata: {name: string}}>('patron_types', filter.key).pipe(map(record => record.metadata.name));
      default: return this.routeToolService.translateService.stream(filter.key);
    }
  }
}
