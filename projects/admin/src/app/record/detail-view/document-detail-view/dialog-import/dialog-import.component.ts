// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DynamicDialogConfig, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog';
import { Message } from '@openng/optimus-ui/message';

@Component({
  selector: 'admin-dialog-import',
  templateUrl: './dialog-import.component.html',
  imports: [RouterLink, Bind, Button, TranslatePipe, Message],
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

  confirm(): void {
    this.dynamicDialogRef.close(true);
  }

  cancel(): void {
    this.dynamicDialogRef.close();
  }
}
