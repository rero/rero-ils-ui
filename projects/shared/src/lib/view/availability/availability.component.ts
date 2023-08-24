/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IAvailability } from '../../interface/i-availability';
import { IAvailabilityService } from '../../service/i-availability.service';

@Component({
  selector: 'shared-availability',
  templateUrl: './availability.component.html'
})
export class AvailabilityComponent implements OnInit {

  /** Resource name */
  @Input() resource: string;

  /** Resource pid */
  @Input() resourcePid: string;

  /** Resource api service */
  @Input() apiService: IAvailabilityService;

  /** Availability data */
  availability: IAvailability;

  /** Current language */
  language: string;

  /**
   * Constructor
   * @param translateService - TranslateService
   */
  constructor(private translateService: TranslateService) {}

  /** OnInit hook */
  ngOnInit(): void {
    this.language = this.translateService.currentLang;
    this.apiService
      .getAvailability(this.resourcePid)
      .subscribe((availability: IAvailability) => this.availability = availability);
  }
}
