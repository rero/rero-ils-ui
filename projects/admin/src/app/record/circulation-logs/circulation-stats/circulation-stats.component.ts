// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import { ItemApiService } from '../../../api/item-api.service';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { UpperCaseFirstPipe } from '@rero/ng-core';
import { TranslatePipe } from '@ngx-translate/core';
import { DefaultPipe } from '../../../pipe/default.pipe';

@Component({
    selector: 'admin-circulation-stats',
    templateUrl: './circulation-stats.component.html',
    imports: [Bind, Panel, UpperCaseFirstPipe, TranslatePipe, DefaultPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirculationStatsComponent implements OnInit {

  private itemApiService: ItemApiService = inject(ItemApiService);

  /** Item record */
  itemPid = input<any>();

  /** Computed stats for current item */
  readonly stats = signal<any>(null);

  /** OnInit hook */
  ngOnInit(): void {
    this.itemApiService.getStatsByItemPid(this.itemPid())
      .subscribe((stats: any) => this.stats.set(stats))
  }
}
