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
import { Component, inject, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'admin-dialog-import',
  templateUrl: './dialog-import.component.html'
})
export class DialogImportComponent implements OnInit {

  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);

  /** Available record */
  records: any[];

  /** Show warning message */
  warning: boolean = false;

  ngOnInit(): void {
      this.records = this.dynamicDialogConfig?.data?.records || [];
      // this.warning = this.dynamicDialogConfig?.data?.warning || false;
      this.warning = true;
  }

  confirm():void {
    this.dynamicDialogRef.close(true);
  }

  cancel(): void {
    this.dynamicDialogRef.close();
  }
}
