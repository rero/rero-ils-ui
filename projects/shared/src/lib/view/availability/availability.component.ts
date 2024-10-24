/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IAvailability } from '../../interface/i-availability';
import { IAvailabilityService } from '../../service/i-availability.service';

@Component({
  selector: 'shared-availability',
  templateUrl: './availability.component.html'
})
export class AvailabilityComponent implements OnInit, OnChanges {

  protected translateService: TranslateService = inject(TranslateService);

  /** Record Type */
  @Input() recordType: string;

  /** Record pid */
  @Input() record: any;

  /** Resource api service */
  @Input() apiService: IAvailabilityService;

  /** View code */
  @Input() viewcode?: string = null;

  /** Availability data */
  availability: IAvailability;

  /** Current language */
  language: string;

  /** OnInit hook */
  ngOnInit(): void {
    this.language = this.translateService.currentLang;
  }

  /** OnChanges hook */
  ngOnChanges(): void {
    this.apiService
    .getAvailability(this.record.metadata.pid, this.viewcode)
    .subscribe((availability: IAvailability) => this.availability = availability);
  }
}
