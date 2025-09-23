/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { RecordService } from '@rero/ng-core';
import { IOrganisation } from '@rero/shared/public-api';
import { Observable, Subscription } from 'rxjs';
import { PatronProfileMenuService } from '../../patron-profile-menu.service';

@Component({
    selector: 'public-search-patron-profile-fee',
    templateUrl: './patron-profile-fee.component.html',
    styleUrl: './patron-profile-fee.component.scss',
    standalone: false
})
export class PatronProfileFeeComponent<T> implements OnInit, OnDestroy {

  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);
  private recordService: RecordService = inject(RecordService);

  /** Fee record */
  @Input() record;

  /** Detail collapsed */
  isCollapsed = true;

  /** Array of event records */
  events = [];

  document = null;

  subscription = new Subscription();

  get organisation(): IOrganisation {
    return this.patronProfileMenuService.currentPatron.organisation;
  }

  ngOnInit(): void {
    if (this.record.loan) {
      this.subscription.add(
        this.recordService.getRecord('documents', this.record.loan.document_pid)
          .subscribe(document => this.document = document)
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getPatronTransaction(pid: string): Observable<T> {
    return this.recordService.getRecord('patron_transactions', pid, 1);
  }
}
