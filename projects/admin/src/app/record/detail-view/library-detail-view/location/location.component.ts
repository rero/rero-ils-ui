/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { ChangeDetectorRef, Component, inject, input, OnInit, output, ChangeDetectionStrategy} from '@angular/core';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { RecordUiService } from '@rero/ng-core';
import { RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'admin-location',
    templateUrl: './location.component.html',
    imports: [RouterLink, Tooltip, Bind, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationComponent implements OnInit {

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private recordUiService: RecordUiService = inject(RecordUiService);
  private recordPermissionService: RecordPermissionService = inject(RecordPermissionService);

  /** The location whose details are displayed */
  location = input<any>();

  /** The parent library of the location */
  library = input<any>();

  /** Delete location event emitter */
  deleteLocation = output<string>();

  /** location record permission */
  permissions: any;

  /**
   * Init
   */
  ngOnInit() {
    this.recordPermissionService.getPermission('locations', this.location().metadata.pid).subscribe(
      (permissions) => {
        this.permissions = permissions;
        this.cdr.markForCheck();
      }
    );
  }

  /**
   * Delete the location
   * @param locationPid - location PID
   */
  delete(locationPid: string) {
    this.recordUiService.deleteRecord('locations', locationPid).subscribe((success: boolean) => {
      if (success) {
        this.deleteLocation.emit(locationPid);
      }
    });
  }

  /**
   * Return a message containing the reasons wht the item cannot be requested
   */
  get deleteInfoMessage(): string {
    return this.recordPermissionService.generateTooltipMessage(this.permissions.delete.reasons, 'delete');
  }

}
