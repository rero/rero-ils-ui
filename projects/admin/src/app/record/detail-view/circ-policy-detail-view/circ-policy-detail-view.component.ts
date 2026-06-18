// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { NgClass, AsyncPipe, CurrencyPipe, I18nPluralPipe, KeyValuePipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-circ-policy-detail-view',
    templateUrl: './circ-policy-detail-view.component.html',
    imports: [TranslateDirective, Bind, Panel, TableModule, NgClass, AsyncPipe, CurrencyPipe, I18nPluralPipe, KeyValuePipe, TranslatePipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircPolicyDetailViewComponent {

  private appStore = inject(AppStore);

  readonly record = input<any>();
  readonly type = input<string>('');

  readonly reminders = computed(() => {
    const r = this.record();
    if (!r?.metadata?.reminders) return [];
    return [...r.metadata.reminders].sort((a: any, b: any) =>
      a.type > b.type ? 1 : a.days_delay - b.days_delay
    );
  });

  readonly overdues = computed(() => {
    const r = this.record();
    if (!r?.metadata?.overdue_fees?.intervals) return [];
    return [...r.metadata.overdue_fees.intervals].sort((a: any, b: any) => a.from - b.from);
  });

  readonly settings = computed(() => {
    const map = new Map<string, string[]>();
    const r = this.record();
    if (!r?.metadata?.settings) return map;
    r.metadata.settings.forEach((setting: any) => {
      if (!map.has(setting.patron_type.pid)) {
        map.set(setting.patron_type.pid, [setting.item_type.pid]);
      } else {
        map.get(setting.patron_type.pid)!.push(setting.item_type.pid);
      }
    });
    return map;
  });

  readonly itemTypes = computed(() => {
    const set = new Set<string>();
    const r = this.record();
    if (!r?.metadata?.settings) return set;
    r.metadata.settings.forEach((s: any) => set.add(s.item_type.pid));
    return set;
  });

  readonly org_currency = computed(() => this.appStore.organisation()?.default_currency);
  readonly checkoutIsAllowed = computed(() => {
    const r = this.record();
    return r && Object.hasOwn(r.metadata, 'checkout_duration');
  });
}
