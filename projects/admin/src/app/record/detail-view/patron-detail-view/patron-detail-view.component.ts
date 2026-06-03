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

import { Component, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { AppStore, IPermissions, PERMISSIONS, PermissionsDirective, LinkPermissionsDirective, JoinPipe } from '@rero/shared';
import { roleTagSeverity } from '../../../utils/roles';
import { Bind } from 'primeng/bind';
import { ButtonDirective } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { NgClass, AsyncPipe, I18nPluralPipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { PatronPermissionsComponent } from './patron-permissions/patron-permissions.component';
import { DateTranslatePipe, GetRecordPipe, Nl2brPipe } from '@rero/ng-core';
import { Message } from 'primeng/message';

type PatronPhone = {
  value: string;
  type?: string;
  weight: number;
}

@Component({
    selector: 'admin-patron-detail-view',
    templateUrl: './patron-detail-view.component.html',
    imports: [Bind, ButtonDirective, PermissionsDirective, RouterLink, Accordion, AccordionPanel, Ripple, AccordionHeader, AccordionContent, TranslateDirective, NgClass, Tag, LinkPermissionsDirective, PatronPermissionsComponent, AsyncPipe, I18nPluralPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe, JoinPipe, Nl2brPipe, Message],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronDetailViewComponent {

  private appStore = inject(AppStore);

  readonly record = input<any>();
  readonly type = input<string>('');

  readonly permissions: IPermissions = PERMISSIONS;

  readonly patron = computed(() => this.record()?.metadata ?? null);
  readonly phones = computed(() => {
    const meta = this.record()?.metadata;
    return meta ? this._processPhones(meta) : [];
  });

  readonly canAccessDisplayPermissions = computed(() => this.appStore.canAccess(PERMISSIONS.PERM_MANAGEMENT));

  getRoleTagSeverity(role: string): string {
    return roleTagSeverity(role);
  }

  getNoteBadgeColor(noteType: string): string {
    switch (noteType) {
      case 'public_note': return 'info';
      case 'staff_note': return 'warn';
      default: return 'secondary';
    }
  }

  private _processPhones(record: any): PatronPhone[] {
    const data: PatronPhone[] = [];
    if (record.mobile_phone) {
      data.push({value: record.mobile_phone, type: 'Mobile', weight: 10});
    }
    if (record.home_phone) {
      data.push({value: record.home_phone, type: 'Home', weight: 7});
    }
    if (record.business_phone) {
      data.push({value: record.business_phone, type: 'Business', weight: 7});
    }
    if (record.other_phone) {
      data.push({value: record.other_phone, type: 'Other', weight: -1});
    }
    return data.sort((a, b) => b.weight - a.weight);
  }
}
