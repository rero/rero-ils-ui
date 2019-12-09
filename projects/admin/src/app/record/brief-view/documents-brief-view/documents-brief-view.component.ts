/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, Input } from '@angular/core';
import { ResultItem, RecordService } from '@rero/ng-core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../service/user.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'admin-documents-brief-view',
  templateUrl: './documents-brief-view.component.html',
  styles: []
})
export class DocumentsBriefViewComponent implements ResultItem {

  @Input()
  record: any;

  @Input()
  type: string;

  @Input()
  detailUrl: { link: string, external: boolean };

  isItemsCollapsed = true;

  items = [];

  groupItems = [];

  constructor(
    private recordsService: RecordService,
    private translate: TranslateService,
    private toastService: ToastrService,
    public userService: UserService
  ) { }

  deleteItem(pid) {
    this.recordsService.delete('items', pid).subscribe((success: any) => {
      if (success) {
        for (const holding of this.record.metadata.holdings) {
          holding.items = holding.items.filter(item => item.pid !== pid);
        }
        this.toastService.success(this.translate.instant('Record deleted'), this.translate.instant('documents'));
      }
    });
  }

  canDeleteItem(item) {
    if (item.links.delete) {
      return true;
    }
    return false;
  }

  canEditItem(item) {
    if (item.links.delete) {
      return true;
    }
    return false;
  }

  toggleCollapse() {
    const observables = [];

    if (this.isItemsCollapsed) {
      this.groupItems = [];
      this.items.map(item => {
        observables.push(this.recordsService.getRecord('items', item.pid));
      });
      combineLatest(observables).subscribe((results: any) => {
        results.map(result =>
          this.groupItems.push(result)
        );
      });
    }
    this.isItemsCollapsed = !this.isItemsCollapsed;
  }
}
