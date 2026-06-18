// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
