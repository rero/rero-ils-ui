/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
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

import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";
import { FormlyFieldConfig } from "@ngx-formly/core";
import {
  DetailComponent,
  EditorComponent,
  JSONSchema7,
  Record,
  RecordSearchPageComponent,
  RecordService,
  RouteInterface,
} from "@rero/ng-core";
import {
  PERMISSIONS,
  PERMISSION_OPERATOR,
} from "@rero/shared";
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from "../guard/can-access.guard";
import { PermissionGuard } from "../guard/permission.guard";
import { StatisticsCfgBriefViewComponent } from "../record/brief-view/statistics-cfg-brief-view-component";
import { StatisticsCfgDetailViewComponent } from "../record/detail-view/statistics-cfg-detail-view/statistics-cfg-detail-view.component";
import { BaseRoute } from "./base-route";

export class StatisticsCfgRoute extends BaseRoute implements RouteInterface {
  /** Route name */
  readonly name = "stats_cfg";

  /** Record type */
  readonly recordType = "stats_cfg";

  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        {
          path: "",
          component: RecordSearchPageComponent,
          canActivate: [PermissionGuard],
          data: {
            permissions: [
              PERMISSIONS.STAT_CFG_ACCESS,
              PERMISSIONS.STAT_CFG_SEARCH,
            ],
            operator: PERMISSION_OPERATOR.AND,
          },
        },
        {
          path: "detail/:pid",
          component: DetailComponent,
          canActivate: [CanAccessGuard],
          data: { action: CAN_ACCESS_ACTIONS.READ },
        },
        {
          path: "edit/:pid",
          component: EditorComponent,
          canActivate: [CanAccessGuard],
          data: { action: CAN_ACCESS_ACTIONS.UPDATE },
        },
        {
          path: "new",
          component: EditorComponent,
          canActivate: [PermissionGuard],
          data: { permissions: [PERMISSIONS.STAT_CFG_CREATE] },
        },
      ],
      data: {
        types: [
          {
            key: this.name,
            label: _("Statistics configuration"),
            editorSettings: {
              longMode: false,
            },
            component: StatisticsCfgBriefViewComponent,
            detailComponent: StatisticsCfgDetailViewComponent,
            aggregationsBucketSize: 10,
            aggregationsExpand: ["library", "category", "frequency"],
            aggregationsOrder: ["library", "category", "frequency"],
            showFacetsIfNoResults: true,
            searchFilters: [
              this.expertSearchFilter(),
              {
                label: _('Active Only'),
                filter: 'active',
                value: 'true'
              }
            ],
            listHeaders: {
              Accept: 'application/rero+json'
            },
            canAdd: () =>
              of({
                can: this.routeToolService.permissionsService.canAccess(
                  PERMISSIONS.STAT_CFG_CREATE
                ),
              }),
            permissions: (record: any) =>
              this.routeToolService.permissions(record, this.recordType),
            formFieldMap: (
              field: FormlyFieldConfig,
              jsonSchema: JSONSchema7
            ): FormlyFieldConfig => {
              return this._populateLocationsByCurrentUserLibrary(field, jsonSchema);
            },
            preCreateRecord: (data: any) => {
              const { user } = this.routeToolService.userService;
              data.library = {
                $ref: this.routeToolService.apiService.getRefEndpoint(
                  "libraries",
                  user.currentLibrary
                ),
              };
              return data;
            },
          },
        ],
      },
    };
  }

  /**
   * Populate select menu with the current user library
   * @param field - FormlyFieldConfig
   * @param jsonSchema - JSONSchema7
   * @return FormlyFieldConfig
   */
  private _populateLocationsByCurrentUserLibrary(field: FormlyFieldConfig, jsonSchema: JSONSchema7): FormlyFieldConfig {
    const formWidget = jsonSchema.widget;
    if (
      formWidget?.formlyConfig?.props?.fieldMap ===
      "libraries"
    ) {
      field.type = "select";
      field.hooks = {
        ...field.hooks,
        onInit: (field: FormlyFieldConfig): void => {
          const { user } = this.routeToolService.userService;
          const { baseUrl } = this.routeToolService.settingsService;
          const prefix = this.routeToolService.apiService.getEndpointByType('libraries');
          if (user.currentLibrary != null && field.formControl.value == null) {
            field.formControl.setValue(
              `${baseUrl}${prefix}/${user.currentLibrary}`);
          }
        },
        afterContentInit: (f: FormlyFieldConfig) => {
          const { apiService, recordService } = this.routeToolService;

          f.props.options = recordService
            .getRecords(
              "libraries",
              "",
              1,
              RecordService.MAX_REST_RESULTS_SIZE,
              undefined,
              undefined,
              undefined,
              "name"
            )
            .pipe(
              map((result: Record) =>
                this.routeToolService.recordService.totalHits(
                  result.hits.total
                ) === 0
                  ? []
                  : result.hits.hits
              ),
              map((hits: any) =>
                hits.map((hit: any) => {
                  return {
                    label: hit.metadata.name,
                    value: apiService.getRefEndpoint(
                      "libraries",
                      hit.metadata.pid
                    ),
                  };
                })
              )
            );
        },
      };
    }
    return field;
  }
}
