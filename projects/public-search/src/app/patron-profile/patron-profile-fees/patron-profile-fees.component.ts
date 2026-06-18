// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import type { EsResult } from '@rero/ng-core';
import { PanelModule } from 'primeng/panel';
import { forkJoin } from 'rxjs';
import { PatronApiService } from '../../api/patron-api.service';
import { PatronTransactionApiService } from '../../api/patron-transaction-api.service';
import { PatronProfileStore } from '../store/patron-profile.store';
import { PatronProfileFeeComponent } from './patron-profile-fee/patron-profile-fee.component';
import { fee, overdueFee } from './types';

@Component({
    selector: 'public-search-patron-profile-fees',
    templateUrl: './patron-profile-fees.component.html',
    imports: [CurrencyPipe, TranslateDirective, TranslatePipe, PanelModule, PatronProfileFeeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileFeesComponent implements OnInit {

  private patronTransactionApiService = inject(PatronTransactionApiService);
  private store = inject(PatronProfileStore);
  private patronApiService = inject(PatronApiService);

  feesTotal = input<number>();

  readonly loaded = signal(false);
  readonly records = signal<any[]>([]);

  get currency() {
    return this.store.currentPatron()?.organisation.currency;
  }

  ngOnInit(): void {
    const patronPid = this.store.currentPatron()!.pid;
    const queryFees = this.patronTransactionApiService.getFees(patronPid, 'open', 1, RecordService.MAX_REST_RESULTS_SIZE);
    const queryOverdue = this.patronApiService.getOverduePreviewByPatronPid(patronPid);

    forkJoin([queryFees, queryOverdue]).subscribe({
      next: ([feesResponse, overdueResponse]: [EsResult, overdueFee[]]) => {
        const records: any[] = [];
        feesResponse.hits.hits.map((record: any) => {
          if (record.metadata?.loan) {
            const result = records.filter((fee: fee) => record.metadata?.loan?.pid === fee.loan?.pid);
            if (result.length === 1) {
              if (record.metadata.note) {
                result[0].notes.push(record.metadata.note);
              }
              result[0].totalAmount += record.metadata.total_amount;
              result[0].transactions.push(record);
            } else {
              records.push(this.buildFee(record));
            }
          } else {
            records.push(this.buildFee(record));
          }
        });
        overdueResponse.map((overdue: overdueFee) => {
          const result = records.filter((record: fee) => record.loan?.pid === overdue.loan.pid);
          if (result.length === 1) {
            result[0].totalAmount += overdue.fees.total;
            result[0].overdue = overdue.fees.total;
          } else {
            records.push({
              type: 'overdue',
              createdAt: new Date(),
              loan: overdue.loan,
              totalAmount: overdue.fees.total,
              overdue: overdue.fees.total
            });
          }
        });
        records.sort((a, b) => a.createdAt - b.createdAt);
        this.records.set(records);
        this.loaded.set(true);
      }
    });
  }

  private buildFee(record): fee {
    const result: fee = {
      type: record.metadata.type,
      notes: [],
      createdAt: new Date(record.metadata.creation_date),
      totalAmount: record.metadata.total_amount,
      transactions: [record]
    };
    if (record.metadata.note) {
      result.notes.push(record.metadata.note);
    }
    if (record.metadata.loan) {
      result.loan = record.metadata.loan;
    }
    return result;
  }
}
