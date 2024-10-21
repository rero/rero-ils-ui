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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordService } from '@rero/ng-core';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'admin-template-detail-view',
  templateUrl: './template-detail-view.component.html'
})
export class TemplateDetailViewComponent implements OnInit, OnDestroy {

  private router: ActivatedRoute = inject(ActivatedRoute);
  private recordService: RecordService = inject(RecordService);

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Observable of the imported record in marc format */
  marc$: Observable<any>;

  /** Resource type */
  type: string;

  /** Document record */
  record: any;

  /** Css classes for dd in template */
  ddCssClass = 'col-9 mb-0';

  /** Css classes for dt in template */
  dtCssClass = 'col-3';

  /** Record subscription */
  private recordSubscription: Subscription;

  /** External identifier for imported record. */
  get pid() {
    return this.router.snapshot.params.pid;
  }

  /** On init hook */
  ngOnInit(): void {
    this.recordSubscription = this.record$.subscribe((record: any) => {
      this.record = record;
      // only for imported record
      if (record != null && record.metadata != null && this.record.metadata.pid == null) {
        this.marc$ = this.recordService.getRecord(
          this.router.snapshot.params.type, this.pid, 0, {
          Accept: 'application/marc+json, application/json'
        });
      } else {
        this.marc$ = of(null);
      }
    });
  }

  /** On destroy hook */
  ngOnDestroy(): void {
    this.recordSubscription.unsubscribe();
  }
}
