// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, input, OnInit, signal } from '@angular/core';
import { HoldingsApiService } from '@app/public-search/api/holdings-api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { Card } from '@openng/optimus-ui/card';

@Component({
  selector: 'public-search-electronic-holdings',
  templateUrl: './electronic-holdings.component.html',
  imports: [TranslatePipe, Card, ButtonDirective],
})
export class ElectronicHoldingsComponent implements OnInit {
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
