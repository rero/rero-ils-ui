/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
