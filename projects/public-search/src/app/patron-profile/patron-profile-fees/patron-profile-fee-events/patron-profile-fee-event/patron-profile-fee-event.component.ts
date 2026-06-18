// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe, RecordData } from '@rero/ng-core';
import { IOrganisation } from '@rero/shared';
import type { EsResult } from '@rero/ng-core';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { PatronTransactionEventApiService } from '../../../../api/patron-transaction-event-api.service';
import { PatronProfileStore } from '../../../store/patron-profile.store';

@Component({
  selector: 'public-search-patron-profile-fee-event',
  templateUrl: './patron-profile-fee-event.component.html',
  imports: [CurrencyPipe, NgClass, TranslateDirective, TranslatePipe, DateTranslatePipe, TagModule, TimelineModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileFeeEventComponent implements OnInit {
    private patronTransactionEventApiService = inject(PatronTransactionEventApiService);
    private store = inject(PatronProfileStore);

    event = input<RecordData>();

    readonly transactionEvents = signal<any[]>([]);

    get organisation(): IOrganisation {
      return this.store.currentPatron()!.organisation;
    }

    ngOnInit(): void {
      this.patronTransactionEventApiService.getEvents((this.event()!.metadata as any).pid)
        .subscribe((response: EsResult) => this.transactionEvents.set(response.hits.hits));
    }
}
