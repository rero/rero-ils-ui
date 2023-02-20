/*
 * RERO ILS UI
 * Copyright (C) 2021-2023 RERO
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
import { RecordService } from '@rero/ng-core';
import { CanExtend } from '../../api/loan-api.service';
import { PatronProfileMenuService } from '../patron-profile-menu.service';

@Component({
  selector: 'public-search-patron-profile-document',
  templateUrl: './patron-profile-document.component.html',
  styleUrls: ['./patron-profile-document.component.scss']
})
export class PatronProfileDocumentComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  @Input() record: any;
  @Input() showAdditionalInformation = false;
  @Input() isAnimated = true;

  /** related document */
  document = undefined;

  // GETTER & SETTER ==========================================================
  /** Get current viewcode */
  get viewcode(): string {
    return this._patronProfileMenuService.currentPatron.organisation.code;
  }

  /** Get the formatted call numbers for the related item */
  get callNumbers(): string {
    return Array(
      this.record.metadata.item.call_number,
      this.record.metadata.item.second_call_number
    ).filter(Boolean).join(' | ');
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _patronProfileMenuService - PatronProfileMenuService
   * @param _translateService - TranslateService
   * @param _recordService - RecordService
   */
  constructor(
    private _patronProfileMenuService: PatronProfileMenuService,
    private _translateService: TranslateService,
    private _recordService: RecordService
  ) {}

  /** OnInit hook */
  ngOnInit(): void {
    this._recordService
      .getRecord('documents', this.record.metadata.document.pid, 1, {Accept: 'application/rero+json, application/json'})
      .subscribe(document => this.document = document.metadata);
  }
}
