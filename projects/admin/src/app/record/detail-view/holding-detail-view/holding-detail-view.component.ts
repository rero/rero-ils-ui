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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'admin-holding-detail-view',
  templateUrl: './holding-detail-view.component.html'
})
export class HoldingDetailViewComponent implements OnInit , OnDestroy, DetailRecord {

  private router: Router = inject(Router);

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** Record */
  record: any;

  /** The observer to the record observable */
  private recordObs: Subscription;

  /**
   * Init hook
   */
  ngOnInit() {
    this.recordObs = this.record$.subscribe(record => {
      this.record = record;
      // TODO : At this time, only 'serial' holding should be displayed. Then redirect user to the document detail view
      if (this.record.metadata.holdings_type !== 'serial') {
        this.router.navigate(['/errors/403'], { skipLocationChange: true });
      }
    });
  }

  /**
   * Destroy hook
   */
  ngOnDestroy(): void {
    this.recordObs.unsubscribe();
  }

}
