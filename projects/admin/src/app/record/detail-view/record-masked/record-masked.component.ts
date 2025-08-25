/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
    @if (record.metadata | keyExists:'_masked') {
      <i
        class="fa"
        aria-hidden="true"
        title="{{ (record.metadata._masked ? 'Masked' : 'No masked') | translate }}"
        [ngClass]="{ 'fa-eye-slash text-error': record.metadata._masked, 'fa-eye text-success': !record.metadata._masked }"
      ></i>
      @if (withLabel) {
        <span class="ui:ml-1">{{ (record.metadata._masked ? 'Masked' : 'No masked') | translate }}</span>
      }
    } @else {
      <i class="fa fa-eye text-success" title="No masked" aria-hidden="true"></i>
      @if (withLabel) {
        <span class="ui:ml-1" translate>No masked</span>
      }
    }
  `,
    standalone: false
})
export class RecordMaskedComponent {

  /** Record */
  @Input() record: any;

  /** Label for bullet context */
  @Input() withLabel = false;

}
