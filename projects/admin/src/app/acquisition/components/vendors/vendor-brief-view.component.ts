/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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

import { Component, input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'admin-vendor-brief-view',
    template: `
    <h5>
      <a [routerLink]="[detailUrl().link]">{{ record().metadata.name }}</a>
    </h5>
    @if (address) {
      @if (address.street) {
        {{ address.street }},
      }
      @if (address.postal_code || address.city) {
        {{ address.postal_code }} {{ address.city }}
      }
      @if (address.country) {
        @if (address.postal_code || address.city) {
          /
        }
        {{ address.country }}
      }
    }
  `,
    styleUrls: [],
    imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorBriefViewComponent implements OnInit {

  /** Record  data */
  record = input<any>();

  /** Resource type */
  type = input<string>();

  /** Detail URL to navigate to detail view */
  detailUrl = input<{ link: string, external: boolean }>();

  // Default address
  address: any;

  /** OnInit hook */
  ngOnInit(): void {
    const contact: any[] = this.record().metadata.contacts.filter((contact: any) => contact.type === 'default');
    this.address = (contact.length > 0) ? contact[0] : undefined;
  }
}
