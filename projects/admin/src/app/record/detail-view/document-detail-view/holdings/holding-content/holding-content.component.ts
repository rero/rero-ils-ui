/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { Component, effect, inject, input, model, ChangeDetectionStrategy} from '@angular/core';
import { EsRecord, PaginatorComponent, SafeUrlPipe } from '@rero/shared';
import { ItemsStore } from '../store/items-store';
import { Bind } from 'primeng/bind';
import { InputGroup } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { SerialHoldingItemComponent } from '../serial-holding-item/serial-holding-item.component';
import { DefaultHoldingItemComponent } from '../default-holding-item/default-holding-item.component';

@Component({
    selector: 'admin-holding-content',
    providers: [ItemsStore],
    templateUrl: './holding-content.component.html',
    imports: [Bind, InputGroup, FormsModule, InputText, InputGroupAddon, TranslateDirective, SerialHoldingItemComponent, DefaultHoldingItemComponent, PaginatorComponent, TranslatePipe, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingContentComponent {

  protected store = inject(ItemsStore);

  holding = input.required<EsRecord>();
  isCurrentOrganisation = input.required<boolean>();

  protected filter = model<string>('');

  constructor() {
    this.store.setFilter(this.filter);
    effect(() => this.store.setHoldings(this.holding()));
  }
}
