// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, inject, input, OnInit, output, signal, ChangeDetectionStrategy} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { ItemApiService } from '../../api/item-api.service';
import { EsRecord, IPatron, AppStore } from '@rero/shared';
import { Tooltip } from 'primeng/tooltip';
import { canRequest } from '../model/can-request-model';

@Component({
  selector: 'public-search-item-request',
  imports: [Button, TranslatePipe, Tooltip],
  template: `
  <p-button
    class="ui:pointer-events-auto"
    outlined
    [hidden]="!hiddenRequestButton()"
    [disabled]="!canRequest().can"
    [tooltipDisabled]="canRequest().can"
    [pTooltip]="tooltip()"
    tooltipPosition="top"
    (onClick)="request.emit(true)"
    >
    <i class="fa-solid fa-cart-arrow-down ui:mr-2"></i>
    {{ 'Request' | translate }}
  </p-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemRequestComponent implements OnInit {
  private itemApiService = inject(ItemApiService);
  private appStore = inject(AppStore);
  private translateService = inject(TranslateService);

  record = input.required<EsRecord>();

  request = output<boolean>();

  canRequest = signal<canRequest>({ can: false });

    reasonsToDisplay = [
      "patron_type_overdue_items_limit",
      "patron_type_fee_amount_limit",
      "patron_type_unpaid_subscription",
      "patron_type_request_limits"
    ]

  allReasonsDisplayable = computed(() =>
    this.canRequest().reasons &&
    Object.keys(this.canRequest().reasons).every(key => this.reasonsToDisplay.includes(key))
  );

  hiddenRequestButton = computed(() => this.canRequest().can || this.allReasonsDisplayable());

  tooltip = computed(() => Object.values(this.canRequest().reasons || {}).map(
    (reason: string) => "- " + this.translateService.instant(reason)
  ).join('\n'));

  private _patron: IPatron;

  ngOnInit(): void {
    if (this.appStore.user() && this.record) {
      this._patron = this.appStore.user()?.getPatronByOrganisationPid(
        this.record().metadata.organisation.pid
      );
      if (this._patron?.patron) {
        this.itemApiService.canRequest(
          this.record().metadata.pid,
          this.record().metadata.library.pid,
          this._patron.patron.barcode[0],
        ).subscribe((can: canRequest) => this.canRequest.set(can));
      }
    }
  }
}
