/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { Component, computed, inject, input, signal, Signal, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { LocalFieldApiService } from '@app/admin/api/local-field-api.service';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { AppStore, IPermissions, JoinPipe, PERMISSIONS } from '@rero/shared';
import { catchError, of, switchMap, tap } from 'rxjs';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'admin-local-field',
    templateUrl: './local-field.component.html',
    providers: [JoinPipe],
    imports: [TranslateDirective, Bind, Button, RouterLink, TranslatePipe, JoinPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalFieldComponent {

  private localFieldApiService: LocalFieldApiService = inject(LocalFieldApiService);
  private appStore = inject(AppStore);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);

  // INPUTS ===================================================================
  readonly resourceType = input<string>();
  readonly resourcePid = input<string>();

  // PUBLIC ===================================================================
  readonly permissions: IPermissions = PERMISSIONS;

  /** Loading state: set to true on each backend call, false when done or on error */
  readonly isLoading = signal(true);

  /** Available resources type for local fields */
  private readonly _resourceTypes: Record<string, string> = {
    documents: 'doc',
    holdings: 'hold',
    items: 'item'
  };

  // SIGNALS ==================================================================

  /** Source of truth: the local_fields record fetched from the API */
  private readonly record = toSignal(
    toObservable(this.resourcePid).pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(pid =>
        this.localFieldApiService.getByResourceTypeAndResourcePidAndOrganisationId(
          this._translateType(this.resourceType()),
          pid,
          this.appStore.currentOrganisationPid()
        ).pipe(
          catchError(() => {
            this.isLoading.set(false);
            return of({});
          })
        )
      )
    ),
    { initialValue: null }
  );

  /** Permissions for the current record */
  readonly recordPermissions = toSignal(
    toObservable(this.record).pipe(
      switchMap(record => {
        if (record?.metadata) {
          return this.recordPermissionService
            .getPermission('local_fields', record.metadata.pid)
            .pipe(
              tap(() => this.isLoading.set(false)),
              catchError(() => {
                this.isLoading.set(false);
                return of({});
              })
            );
        }
        this.isLoading.set(false);
        return of({});
      })
    ),
    { initialValue: null }
  );

  /** Pid of the LocalField record */
  readonly localFieldRecordPid: Signal<string | null> = computed(
    () => this.record()?.metadata?.pid ?? null
  );

  /** Sorted local fields ready for display */
  readonly localFields: Signal<{ name: string; value: string[] }[]> = computed(() => {
    const fields = this.record()?.metadata?.fields;
    if (!fields) return [];
    return Object.keys(fields)
      .sort((k1, k2) => parseInt(k1.replace(/\D/g, '')) - parseInt(k2.replace(/\D/g, '')))
      .map(key => ({ name: key, value: fields[key] }));
  });

  // PUBLIC FUNCTIONS =========================================================
  /** Delete the complete LocalField resource. */
  delete(): void {
    this.localFieldApiService
      .delete(this.localFieldRecordPid())
      .subscribe((success: any) => {
        if (success) {
          // The parent detail view is expected to re-render after deletion.
          // Nothing to do here as record() will be stale until next navigation.
        }
      });
  }

  // PRIVATE FUNCTIONS ========================================================
  private _translateType(resourceType: string): string {
    if (resourceType in this._resourceTypes) {
      return this._resourceTypes[resourceType];
    }
    throw new Error(`Local fields: missing resource type ${resourceType}.`);
  }
}
