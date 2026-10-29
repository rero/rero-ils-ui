// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PanelModule } from '@openng/optimus-ui/panel';
import { TagModule } from '@openng/optimus-ui/tag';
import { TimelineModule } from '@openng/optimus-ui/timeline';
import { DateTranslatePipe, RecordService } from '@rero/ng-core';
import { IOrganisation, MainTitlePipe, OpenCloseButtonComponent } from '@rero/shared';
import { Observable, Subscription } from 'rxjs';

import { PatronProfileStore } from '../../store/patron-profile.store';
import { PatronProfileFeeEventsComponent } from '../patron-profile-fee-events/patron-profile-fee-events.component';
import { Fee } from '../types';

@Component({
  selector: 'public-search-patron-profile-fee',
  templateUrl: './patron-profile-fee.component.html',
  styleUrl: './patron-profile-fee.component.scss',
  imports: [
    CurrencyPipe,
    TranslatePipe,
    DateTranslatePipe,
    MainTitlePipe,
    OpenCloseButtonComponent,
    PanelModule,
    TagModule,
    TimelineModule,
    PatronProfileFeeEventsComponent,
  ],
})
export class PatronProfileFeeComponent<T> implements OnInit, OnDestroy {
  private store = inject(PatronProfileStore);
  private recordService = inject(RecordService);

  /** Fee record */
  record = input<Fee>();

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
        this.recordService
          .getRecord('documents', this.record()?.loan.document_pid)
          .subscribe((document) => this.document.set(document)),
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
