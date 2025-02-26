/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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

import { Component, inject, Input, OnInit } from '@angular/core';
import { HoldingsApiService } from 'projects/public-search/src/app/api/holdings-api.service';

@Component({
    selector: 'public-search-electronic-holdings',
    templateUrl: './electronic-holdings.component.html',
    standalone: false
})
export class ElectronicHoldingsComponent implements OnInit{

  private holdingsApiService: HoldingsApiService = inject(HoldingsApiService);

  @Input() documentPid;
  @Input() viewcode;

  holdings = [];

  ngOnInit(): void {
      const query = `document.pid:${this.documentPid} AND holdings_type:electronic NOT _masked:true`;
      this.holdingsApiService.getElectronicHoldingsByDocumentPidAndViewcode(this.documentPid, this.viewcode, 1, 100).subscribe((hits: any) => this.holdings = hits.hits);
  }

}
