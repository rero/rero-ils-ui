// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RecordData } from '@rero/ng-core';
import { AppStore, IPatron } from '@rero/shared';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { HoldingsApiService } from '../../api/holdings-api.service';
import { ItemApiService } from '../../api/item-api.service';
import { canRequest } from '../model/can-request-model';
import { PickupLocationComponent } from './pickup-location/pickup-location.component';

@Component({
  selector: 'public-search-request',
  templateUrl: './holdings-request.component.html',
  imports: [Button, Tooltip, PickupLocationComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingsRequestComponent implements OnInit {

  private itemApiService = inject(ItemApiService);
  private holdingsApiService = inject(HoldingsApiService);
  private appStore = inject(AppStore);
  private translateService = inject(TranslateService);

  record = input<RecordData>();
  recordType = input<string>();
  viewcode = input<string>();
  holdingsItemsCount = input<number>();

  requestDialogEvent = output<boolean>();

  canRequest = signal<canRequest>({ can: false, reasons: {} });
  requestDialog = signal(false);

  private patron = signal<IPatron | null>(null);
  hasPatron = computed(() => this.patron() !== null);

  private readonly reasonsToDisplay = [
    'patron_type_overdue_items_limit',
    'patron_type_fee_amount_limit',
    'patron_type_unpaid_subscription',
    'patron_type_request_limits',
  ];

  allReasonsDisplayable = computed(() =>
    this.canRequest().reasons &&
    Object.keys(this.canRequest().reasons).every(key => this.reasonsToDisplay.includes(key))
  );

  hiddenRequestButton = computed(() => this.canRequest().can || this.allReasonsDisplayable());

  tooltip = computed(() =>
    Object.values(this.canRequest().reasons || {})
      .map((reason: string) => '- ' + this.translateService.instant(reason))
      .join('\n')
  );

  ngOnInit(): void {
    const canRequest$: (pid: string, libraryPid: string, barcode: string) => Observable<canRequest> =
      this.recordType() === 'holding'
        ? (pid, lib, bc) => this.holdingsApiService.canRequest(pid, lib, bc) as unknown as Observable<canRequest>
        : this.recordType() === 'item'
          ? (pid, lib, bc) => this.itemApiService.canRequest(pid, lib, bc)
          : () => { throw new TypeError(`${this.recordType()} isn't supported`); };

    const user = this.appStore.user();
    const record = this.record();
    if (!user || !record) return;

    const metadata = record.metadata as { pid: string; organisation: { pid: string }; library: { pid: string } };
    const patron = user.getPatronByOrganisationPid(metadata['organisation'].pid) ?? null;
    this.patron.set(patron);

    if (patron?.patron) {
      canRequest$(
        metadata['pid'],
        metadata['library'].pid,
        patron.patron.barcode[0],
      ).subscribe(can => this.canRequest.set(can));
    }
  }

  closeDialog(): void {
    this.requestDialog.set(false);
    this.requestDialogEvent.emit(false);
  }

  showRequestDialog(): void {
    this.requestDialog.set(true);
    this.requestDialogEvent.emit(true);
  }
}
