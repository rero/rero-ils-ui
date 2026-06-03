/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
 * Copyright (C) 2021 UCLouvain
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
import { I18nPluralPipe, NgClass, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { extractIdOnRef, Nl2brPipe } from '@rero/ng-core';

import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { SharedModule } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { Ripple } from 'primeng/ripple';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs/operators';
import { AcqOrderStatus, IAcqOrder } from '../../../classes/order';
import { NoteBadgeColorPipe } from '../../../pipes/note-badge-color.pipe';
import { NotesComponent } from '../../notes/notes.component';
import { ReceiptListComponent } from '../../receipt/receipt-list/receipt-list.component';
import { OrderEmailFormComponent } from '../order-email-form/order-email-form.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderLinesComponent } from './order-lines/order-lines.component';
import { OrderDetailStore } from './store/order-detail.store';

@Component({
    selector: 'admin-acquisition-order-detail-view',
    templateUrl: './order-detail-view.component.html',
    imports: [NgClass, Bind, Button, OrderSummaryComponent, TranslateDirective, Tag, Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, Accordion, AccordionPanel, AccordionHeader, RouterLink, AccordionContent, OrderLinesComponent, OrderHistoryComponent, NotesComponent, ReceiptListComponent, I18nPluralPipe, Nl2brPipe, TranslatePipe, NoteBadgeColorPipe, TooltipModule, Message, Badge, SharedModule],
    providers: [OrderDetailStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailViewComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly scroller: ViewportScroller = inject(ViewportScroller);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly dialogService: DialogService = inject(DialogService);

  protected readonly store = inject(OrderDetailStore);

  // COMPONENT ATTRIBUTES =====================================================
  readonly record = input<any>();
  readonly type = input<string>('');

  notesCollapsed = true;
  acqOrderStatus = AcqOrderStatus;
  modalRef: DynamicDialogRef | null | undefined;

  readonly tabActiveIndex = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('tab') || 'order')),
    { initialValue: 'order' }
  );

  constructor() {
    effect(() => this.store.setFromRecord(this.record()));
  }

  // COMPONENT FUNCTIONS =======================================================

  onTabChange(tab: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  scrollTo(e: Event, anchorId: string): void {
    e.preventDefault();
    this.scroller.scrollToAnchor(anchorId);
  }

  placeOrderDialog(): void {
    this.modalRef = this.dialogService.open(OrderEmailFormComponent, {
      header: this.translateService.instant('Place order'),
      modal: true,
      focusOnShow: false,
      width: '60vw',
      data: { order: this.store.order() },
    });
    this.modalRef.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((order?: IAcqOrder) => {
      if (order) {
        if (order.vendor.$ref) {
          order.vendor.pid = extractIdOnRef(order.vendor.$ref);
        }
        this.store.updateOrder(order);
      }
    });
  }
}
