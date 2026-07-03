// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { KeyExistsPipe } from '@rero/shared';

@Component({
    selector: 'admin-record-masked',
    template: `
    @if (record().metadata | keyExists:'_masked') {
      <i
        class="fa-solid"
        aria-hidden="true"
        title="{{ (record().metadata._masked ? 'Masked' : 'No masked') | translate }}"
        [ngClass]="{ 'fa-eye-slash text-error': record().metadata._masked, 'fa-eye text-success': !record().metadata._masked }"
      ></i>
      @if (withLabel()) {
        <span class="ui:ml-1">{{ (record().metadata._masked ? 'Masked' : 'No masked') | translate }}</span>
      }
    } @else {
      <i class="fa-solid fa-eye text-success" title="No masked" aria-hidden="true"></i>
      @if (withLabel()) {
        <span class="ui:ml-1" translate>No masked</span>
      }
    }
  `,
    imports: [NgClass, TranslateDirective, TranslatePipe, KeyExistsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordMaskedComponent {

  /** Record */
  record = input<any>();

  /** Label for bullet context */
  withLabel = input(false);

}
