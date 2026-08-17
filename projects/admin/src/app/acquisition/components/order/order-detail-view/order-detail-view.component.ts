// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { I18nPluralPipe, NgClass, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { extractIdOnRef, fixOverlayTouchScroll, Nl2brPipe } from '@rero/ng-core';

import { AcqOrderStatus, IAcqOrder } from '@app/admin/acquisition/classes/order';
import { NotesComponent } from '@app/admin/acquisition/components/notes/notes.component';
import { OrderEmailFormComponent } from '@app/admin/acquisition/components/order/order-email-form/order-email-form.component';
import { OrderSummaryComponent } from '@app/admin/acquisition/components/order/order-summary/order-summary.component';
import { ReceiptListComponent } from '@app/admin/acquisition/components/receipt/receipt-list/receipt-list.component';
import { NoteBadgeColorPipe } from '@app/admin/acquisition/pipes/note-badge-color.pipe';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { SharedModule } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { Ripple } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { map, startWith } from 'rxjs/operators';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderLinesComponent } from './order-lines/order-lines.component';
import { OrderDetailStore } from './store/order-detail.store';

type SortOption = {
  value: string;
  label: string;
  icon: string;
};

@Component({
    selector: 'admin-acquisition-order-detail-view',
    templateUrl: './order-detail-view.component.html',
    imports: [NgClass, Bind, Button, OrderSummaryComponent, TranslateDirective, Tag, Tabs, TabList, Ripple, Tab, TabPanels, TabPanel, Accordion, AccordionPanel, AccordionHeader, RouterLink, AccordionContent, OrderLinesComponent, OrderHistoryComponent, NotesComponent, ReceiptListComponent, I18nPluralPipe, Nl2brPipe, TranslatePipe, NoteBadgeColorPipe, TooltipModule, Message, Badge, SharedModule, SelectModule, FormsModule],
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

  private readonly currentLanguage = toSignal(
    this.translateService.onLangChange.pipe(
      map(() => this.translateService.getCurrentLang()),
      startWith(this.translateService.getCurrentLang())
    ),
    { initialValue: this.translateService.getCurrentLang() }
  );

  readonly sortingCriteria = computed<SortOption[]>(() => {
    this.currentLanguage();
    return [
      { value: 'documenttitle', label: this.translateService.instant('Title (A-Z)'), icon: 'fa-solid fa-arrow-down-a-z' },
      { value: '-priority', label: this.translateService.instant('Priority (highest)'), icon: 'fa-solid fa-arrow-down-9-1' },
      { value: 'status', label: this.translateService.instant('Status (A-Z)'), icon: 'fa-solid fa-arrow-down-a-z' },
      { value: 'created', label: this.translateService.instant('Created (oldest)'), icon: 'fa-solid fa-arrow-down-1-9' },
      { value: '-created', label: this.translateService.instant('Created (newest)'), icon: 'fa-solid fa-arrow-down-9-1' },
      { value: 'updated', label: this.translateService.instant('Updated (oldest)'), icon: 'fa-solid fa-arrow-down-1-9' },
      { value: '-updated', label: this.translateService.instant('Updated (newest)'), icon: 'fa-solid fa-arrow-down-9-1' },
    ];
  });

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

  onSortSelectShow(): void {
    fixOverlayTouchScroll('.p-select-overlay');
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
