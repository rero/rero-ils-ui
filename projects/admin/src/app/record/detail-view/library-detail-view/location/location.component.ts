// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RecordUiService } from '@rero/ng-core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
    selector: 'admin-location',
    templateUrl: './location.component.html',
    imports: [RouterLink, Tooltip, Bind, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationComponent {

  private recordUiService: RecordUiService = inject(RecordUiService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);

  location = input<any>();
  library = input<any>();

  deleteLocation = output<string>();

  permissions = toSignal(
    toObservable(this.location).pipe(
      filter(loc => !!loc?.metadata?.pid),
      switchMap(loc => this.recordPermissionService.getPermission('locations', loc.metadata.pid)),
    )
  );

  deleteInfoMessage = computed(() =>
    this.recordPermissionService.generateTooltipMessage(this.permissions()?.delete?.reasons, 'delete')
  );

  delete(locationPid: string) {
    this.recordUiService.deleteRecord('locations', locationPid).pipe(
      take(1)
    ).subscribe((success: boolean) => {
      if (success) {
        this.deleteLocation.emit(locationPid);
      }
    });
  }
}
