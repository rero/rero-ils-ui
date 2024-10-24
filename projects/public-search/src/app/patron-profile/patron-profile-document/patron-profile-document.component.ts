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
import { RecordService } from '@rero/ng-core';
import { PatronProfileMenuService } from '../patron-profile-menu.service';

@Component({
  selector: 'public-search-patron-profile-document',
  templateUrl: './patron-profile-document.component.html',
  styleUrls: ['./patron-profile-document.component.scss']
})
export class PatronProfileDocumentComponent implements OnInit {

  private patronProfileMenuService: PatronProfileMenuService = inject(PatronProfileMenuService);
  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES =====================================================
  @Input() record: any;
  @Input() showAdditionalInformation = false;
  @Input() isAnimated = true;

  /** related document */
  document = undefined;

  // GETTER & SETTER ==========================================================
  /** Get current viewcode */
  get viewcode(): string {
    return this.patronProfileMenuService.currentPatron.organisation.code;
  }

  /** Get the formatted call numbers for the related item */
  get callNumbers(): string {
    return Array(
      this.record.metadata.item.call_number,
      this.record.metadata.item.second_call_number
    ).filter(Boolean).join(' | ');
  }

  /** OnInit hook */
  ngOnInit(): void {
    this.recordService
      .getRecord('documents', this.record.metadata.document.pid, 1, {Accept: 'application/rero+json, application/json'})
      .subscribe(document => this.document = document.metadata);
  }
}
