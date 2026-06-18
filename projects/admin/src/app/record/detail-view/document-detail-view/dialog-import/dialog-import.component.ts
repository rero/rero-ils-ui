// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

@Component({
    selector: 'admin-dialog-import',
    templateUrl: './dialog-import.component.html',
    imports: [TranslateDirective, RouterLink, Bind, Button, TranslatePipe, Message],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogImportComponent implements OnInit {

  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);

  /** Available record */
  records: any[];

  /** Show warning message */
  warning = false;

  ngOnInit(): void {
      this.records = this.dynamicDialogConfig?.data?.records || [];
      this.warning = this.dynamicDialogConfig?.data?.warning || false;
  }

  confirm():void {
    this.dynamicDialogRef.close(true);
  }

  cancel(): void {
    this.dynamicDialogRef.close();
  }
}
