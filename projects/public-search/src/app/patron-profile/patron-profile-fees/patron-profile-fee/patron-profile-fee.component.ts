// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe, RecordService } from '@rero/ng-core';
import { MainTitlePipe, OpenCloseButtonComponent, IOrganisation } from '@rero/shared';
import { fee } from '../types';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { Observable, Subscription } from 'rxjs';
import { PatronProfileStore } from '../../store/patron-profile.store';
import { PatronProfileFeeEventsComponent } from '../patron-profile-fee-events/patron-profile-fee-events.component';

@Component({
    selector: 'public-search-patron-profile-fee',
    templateUrl: './patron-profile-fee.component.html',
    styleUrl: './patron-profile-fee.component.scss',
    imports: [
      CurrencyPipe,
      TranslateDirective,
      TranslatePipe,
      DateTranslatePipe,
      MainTitlePipe,
      OpenCloseButtonComponent,
      PanelModule,
      TagModule,
      TimelineModule,
      PatronProfileFeeEventsComponent,
    ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileFeeComponent<T> implements OnInit, OnDestroy {

  private store = inject(PatronProfileStore);
  private recordService = inject(RecordService);

  /** Fee record */
  record = input<fee>();

  /** Detail collapsed */
  isCollapsed = true;

  /** Array of event records */
  events = [];

  readonly document = signal<any>(null);

  subscription = new Subscription();

  get organisation(): IOrganisation {
    return this.store.currentPatron()!.organisation;
  }

  ngOnInit(): void {
    if (this.record()?.loan) {
      this.subscription.add(
        this.recordService.getRecord('documents', this.record()?.loan.document_pid)
          .subscribe(document => this.document.set(document))
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getPatronTransaction(pid: string): Observable<T> {
    return this.recordService.getRecord('patron_transactions', pid, { resolve: 1 });
  }
}
