/*
 * RERO ILS UI
 * Copyright (C) 2019-2026 RERO
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
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { AppStore } from '@rero/shared';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { filter, map, startWith } from 'rxjs';
import { CirculationStore } from '../../store/circulation.store';
import { CardComponent } from '../card/card.component';
import { Bind } from 'primeng/bind';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { Ripple } from 'primeng/ripple';
import { CentsCurrencyPipe } from '../../../acquisition/pipes/cents-currency.pipe';
import { BadgeModule } from 'primeng/badge';

@Component({
    selector: 'admin-main',
    templateUrl: './main.component.html',
    imports: [CardComponent, Bind, Tabs, TabList, Ripple, Tab, RouterLink, RouterOutlet, CentsCurrencyPipe, TranslatePipe, BadgeModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  protected appStore = inject(AppStore);
  private hotKeysService: HotkeysService = inject(HotkeysService);
  private translateService: TranslateService = inject(TranslateService);

  protected store = inject(CirculationStore);

  // COMPONENT ATTRIBUTES ====================================================
  private readonly SHORTCUT_KEYS = ['1', '2', '3', '4', '5', '6', '7'];

  readonly barcode = signal('');
  readonly menuItems = computed<MenuItem[]>(() => {
    const patron = this.store.patron();
    if (!patron) return [];
    const barcode = this.barcode();
    const items: MenuItem[] = [
      { id: 'loan', label: this.translateService.instant('On loan'), routerLink: ['/circulation', 'patron', barcode, 'loan'] },
      { id: 'pickup', label: this.translateService.instant('To pick up'), routerLink: ['/circulation', 'patron', barcode, 'pickup'] },
      { id: 'pending', label: this.translateService.instant('Pending'), routerLink: ['/circulation', 'patron', barcode, 'pending'] },
      { id: 'ill', label: this.translateService.instant('Interlibrary loan'), routerLink: ['/circulation', 'patron', barcode, 'ill'] },
      { id: 'profile', label: this.translateService.instant('Profile'), routerLink: ['/circulation', 'patron', barcode, 'profile'] },
      { id: 'fees', label: this.translateService.instant('Fees'), routerLink: ['/circulation', 'patron', barcode, 'fees'], severity: 'warn', withCurrency: true },
    ];
    if (patron.keep_history) {
      items.push({ id: 'history', label: this.translateService.instant('History'), routerLink: ['/circulation', 'patron', barcode, 'history'] });
    }
    return items;
  });
  readonly activeTab = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url.split('/').pop() ?? ''),
      startWith(this.router.url.split('/').pop() ?? '')
    ),
    { initialValue: this.router.url.split('/').pop() ?? '' }
  );

  readonly shortcuts = computed(() => {
    const patron = this.store.patron();
    if (!patron) return [];
    const group = this.translateService.instant('Patron profile shortcuts');
    const nav = (tab: string) => () => this.router.navigate(['/circulation', 'patron', this.barcode(), tab]);
    const base = [
      { keys: '1', group, description: this.translateService.instant('Go to "circulation" tab'), callback: nav('loan') },
      { keys: '2', group, description: this.translateService.instant('Go to "pickup" tab'), callback: nav('pickup') },
      { keys: '3', group, description: this.translateService.instant('Go to "pending" tab'), callback: nav('pending') },
      { keys: '4', group, description: this.translateService.instant('Go to "ILL" tab'), callback: nav('ill') },
      { keys: '5', group, description: this.translateService.instant('Go to "patron profile" tab'), callback: nav('profile') },
      { keys: '6', group, description: this.translateService.instant('Go to "fees" tab'), callback: nav('fees') },
    ];
    if (patron.keep_history) {
      base.push({ keys: '7', group, description: this.translateService.instant('Go to "history" tab'), callback: nav('history') });
    }
    return base;
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this._unregisterShortcuts();
      this.store.clear();
    });

    effect(() => {
      const shortcuts = this.shortcuts();
      this._unregisterShortcuts();
      for (const { callback, ...config } of shortcuts) {
        this.hotKeysService.addShortcut(config).subscribe(() => callback());
      }
    });

    const routeParams = toSignal(this.route.params, { initialValue: {} as Record<string, string> });
    effect(() => {
      const barcode = routeParams()['barcode'];
      if (barcode && this.barcode() !== barcode) {
        this.load(barcode);
      }
    });
  }

  load(barcode: string): void {
    this.barcode.set(barcode);
    this.store.clear();
    this.store.loadPatron(barcode);
  }

  clearPatron(): void {
    this.router.navigate(['/circulation']);
  }

  private _unregisterShortcuts(): void {
    const registeredKeys = this.hotKeysService.getHotkeys().map(s => s.keys);
    const toRemove = registeredKeys.filter(k => this.SHORTCUT_KEYS.includes(k));
    if (toRemove.length > 0) {
      this.hotKeysService.removeShortcuts(toRemove);
    }
  }
}
