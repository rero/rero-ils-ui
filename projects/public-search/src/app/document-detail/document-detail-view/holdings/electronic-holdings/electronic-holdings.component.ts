// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import { HoldingsApiService } from '@app/public-search/api/holdings-api.service';
import { Card } from 'primeng/card';
import { TranslateDirective } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';

@Component({
    selector: 'public-search-electronic-holdings',
    templateUrl: './electronic-holdings.component.html',
    imports: [Card, TranslateDirective, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElectronicHoldingsComponent implements OnInit{

  private holdingsApiService: HoldingsApiService = inject(HoldingsApiService);

  documentPid = input<string>();
  viewcode = input<string>();

  readonly holdings = signal<any[]>([]);

  ngOnInit(): void {
      this.holdingsApiService
        .getElectronicHoldingsByDocumentPidAndViewcode(this.documentPid(), this.viewcode(), 1, 100)
        .subscribe((hits: any) => this.holdings.set(hits.hits));
  }
}
