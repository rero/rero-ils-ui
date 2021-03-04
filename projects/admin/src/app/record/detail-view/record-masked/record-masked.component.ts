/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-record-masked',
  template: `
  <container-element [ngSwitch]="context">
    <some-element *ngSwitchCase="'eye'">
      <ng-container *ngIf="record.metadata | keyExists:'_masked'; else noEyeMasked">
        <i
          class="fa"
          aria-hidden="true"
          title="{{ (record.metadata._masked ? 'Masked' : 'No masked') | translate }}"
          [ngClass]="{ 'fa-eye-slash text-danger': record.metadata._masked, 'fa-eye text-success': !record.metadata._masked }"
        ></i>
        <label class="ml-1" *ngIf="withLabel">{{ (record.metadata._masked ? 'Masked' : 'No masked') | translate }}</label>
      </ng-container>
      <ng-template #noEyeMasked>
        <i class="fa fa-eye text-success" title="No masked" aria-hidden="true"></i>
        <label class="ml-1" *ngIf="withLabel" translate>No masked</label>
      </ng-template>
    </some-element>
    <some-element *ngSwitchCase="'bullet'">
      <ng-container *ngIf="record.metadata | keyExists:'_masked'; else noBulletMasked">
        <i
          class="fa fa-circle"
          title="{{ (record.metadata._masked ? 'Masked' : 'No masked') | translate }}"
          [ngClass]="{'text-danger': !record.metadata._masked, 'text-success': record.metadata._masked }"
          aria-hidden="true"
        ></i>
        <label class="ml-1" *ngIf="withLabel">{{ (record.metadata._masked ? 'Masked' : 'No masked') | translate }}</label>
      </ng-container>
      <ng-template #noBulletMasked>
        <i class="fa fa-circle text-danger mr-1" title="No masked" aria-hidden="true"></i>
        <label class="ml-1" *ngIf="withLabel" translate>No masked</label>
      </ng-template>
    </some-element>
  </container-element>
  `
})
export class RecordMaskedComponent {

  /** Record */
  @Input() record: any;

  /** Context */
  @Input() context: 'bullet' | 'eye' = 'eye';

  /** Label for bullet context */
  @Input() withLabel = false;

}
