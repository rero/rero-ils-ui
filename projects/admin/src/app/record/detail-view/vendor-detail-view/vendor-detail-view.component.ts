/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { OperationLogsService } from '../../../service/operation-logs.service';

@Component({
  selector: 'admin-vendor-detail-view',
  templateUrl: './vendor-detail-view.component.html',
  styleUrls: []
})
export class VendorDetailViewComponent implements DetailRecord {

  private translateService: TranslateService = inject(TranslateService);
  private operationLogsService: OperationLogsService = inject(OperationLogsService);

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** Load operation logs on show */
  showOperationLogs = false;

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this.operationLogsService.isLogVisible('vendors');
  }

  /**
   * Get Current language interface
   * @return string - language
   */
  get currentLanguage() {
    return this.translateService.currentLang;
  }

  filterContact(contacts: any[], type: string): any {
    const contact = contacts.filter((contact: any) => contact.type === type);
    return contact.length === 0 ? undefined : contact[0];
  }
}
