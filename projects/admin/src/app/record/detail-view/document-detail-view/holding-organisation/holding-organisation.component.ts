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
import { Component, inject, Input, OnInit } from '@angular/core';
import { UserService } from '@rero/shared';
import { HoldingsApiService } from '@app/admin/api/holdings-api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'admin-holding-organisation',
  templateUrl: './holding-organisation.component.html',
  styleUrls: ['./holding-organisation.component.scss']
})
export class HoldingOrganisationComponent implements OnInit {

  private holdingsApiService: HoldingsApiService = inject(HoldingsApiService);
  private userService: UserService = inject(UserService);

  /** Document record */
  @Input() document: any;

  /** All elements is loaded */
  ready = false;
  /** Holdings count for current organisation */
  currentOrganisationCount = 0;
  /** Holdings count for other organisation */
  otherOrganisationCount = 0;

  /** Get the holding type used to add a new holding. */
  get holdingType(): 'standard'|'electronic'|'serial' {
    const data = this.document.metadata;
    if (data.issuance.main_type === 'rdami:1003') {
      return 'serial';
    }
    if (data.harvested === true && data.type === 'ebook') {
      return 'electronic';
    }
    return 'standard';
  }

  /** On init hook */
  ngOnInit(): void {
    const documentPid = this.document.metadata.pid;
    const organisationPid = this.userService.user.currentOrganisation;
    const currentOrganisation$ = this.holdingsApiService.getHoldingsCount(
      documentPid, organisationPid);
    const otherOrganisation$ = this.holdingsApiService.getHoldingsCount(
      documentPid, organisationPid, false
    );

    forkJoin([currentOrganisation$, otherOrganisation$])
      .subscribe(([currentCount, otherCount]) => {
        this.currentOrganisationCount = currentCount;
        this.otherOrganisationCount = otherCount;
        this.ready = true;
      });
  }
}
