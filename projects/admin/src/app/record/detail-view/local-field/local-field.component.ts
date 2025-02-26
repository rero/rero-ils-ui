/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { LocalFieldApiService } from '@app/admin/api/local-field-api.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { IPermissions, JoinPipe, PERMISSIONS, UserService } from '@rero/shared';
import { of, Subscription, switchMap } from 'rxjs';

@Component({
    selector: 'admin-local-field',
    templateUrl: './local-field.component.html',
    providers: [JoinPipe],
    standalone: false
})
export class LocalFieldComponent implements OnInit {

  private localFieldApiService: LocalFieldApiService = inject(LocalFieldApiService);
  private userService: UserService = inject(UserService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Resource Type */
  @Input() resourceType: string;
  /** Resource pid */
  @Input() resourcePid: string;

  /** Pid of the LocalField record */
  localFieldRecordPid: string;
  /** local fields */
  localFields: Array<{name: string, value: Array<string>}> = [];
  /** isLoading */
  isLoading = true;
  /** return all available permissions for current user */
  permissions: IPermissions = PERMISSIONS;
  /** recordPermissions */
  recordPermissions: any;

  /** Available resources type for local fields */
  private _resourceTypes = {
    documents: 'doc',
    holdings: 'hold',
    items: 'item'
  };

  /** OnInit hook */
  ngOnInit() {
    this.localFieldApiService
      .getByResourceTypeAndResourcePidAndOrganisationId(
        this._translateType(this.resourceType),
        this.resourcePid,
        this.userService.user.currentOrganisation
      ).pipe(
        switchMap((record: any) => {
          if (record?.metadata) {
            this.localFieldRecordPid = record.metadata.pid;
            if (record.metadata?.fields) {
              const { fields } = record.metadata;
              // Sort local fields using numeric part of the field name.
              const sortKeys = Object.keys(fields).sort((k1, k2) => parseInt(k1.replace(/\D/g, '')) - parseInt(k2.replace(/\D/g, '')));
              for (const key of sortKeys) {
                this.localFields.push({name: key, value: fields[key]});
              }
            }
            // Permission loading
            return this.recordPermissionService
                .getPermission('local_fields', record.metadata.pid);
          } else {
            return of({});
          }
        })
      ).subscribe((permissions) => {
        this.recordPermissions = permissions;
        this.isLoading = false;
      });
  }

  // PUBLIC FUNCTIONS =========================================================
  /** Delete the complete LocalField resource. */
  delete(): void {
    this.localFieldApiService
      .delete(this.localFieldRecordPid)
      .subscribe((success: any) => {
        if (success) {
          this.localFields = [];
        }
      });
  }

  // PRIVATE FUNCTIONS ========================================================
  /**
   * Translate resource type to symbol
   * @param resourceType - string, name of resource
   * @return string, resource symbol
   */
  private _translateType(resourceType: string): string {
    if (resourceType in this._resourceTypes) {
      return this._resourceTypes[resourceType];
    }
    throw new Error(`Local fields: missing resource type ${resourceType}.`);
  }
}
