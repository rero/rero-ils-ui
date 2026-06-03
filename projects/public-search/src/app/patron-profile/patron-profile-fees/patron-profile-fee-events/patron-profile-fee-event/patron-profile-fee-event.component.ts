/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
