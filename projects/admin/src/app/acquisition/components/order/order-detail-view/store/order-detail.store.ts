// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed, effect, inject, untracked } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AppStore, RecordPermissions } from '@rero/shared';
import { EMPTY, pipe } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { AcqOrderApiService } from '../../../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../../../api/acq-receipt-api.service';
import { RecordPermissionService } from '../../../../../service/record-permission.service';
import { validateReceivedOrderPermissions } from '../../../../utils/permissions';
import {
  AcqOrderHistoryVersion,
  AcqOrderStatus,
  IAcqOrder,
  IAcqOrderLine,
} from '../../../../classes/order';
import { IAcqReceipt } from '../../../../classes/receipt';

export type OrderDetailState = {
  order: IAcqOrder | undefined;
  orderPermissions: RecordPermissions | undefined;
  orderLines: IAcqOrderLine[];
  receipts: IAcqReceipt[];
  receiptPermissions: RecordPermissions | undefined;
  historyVersions: AcqOrderHistoryVersion[];
};

export const OrderDetailStore = signalStore(
  withState<OrderDetailState>({
    order: undefined,
    orderPermissions: undefined,
    orderLines: [],
    receipts: [],
    receiptPermissions: undefined,
    historyVersions: [],
  }),
  withComputed((store) => ({
    canPlaceOrder: () => {
      const o = store.order();
      return o?.status === AcqOrderStatus.PENDING && (o?.account_statement?.provisional?.total_amount ?? 0) > 0;
    },
    canAddLine: () =>
      store.order()?.status === AcqOrderStatus.PENDING && store.orderPermissions()?.update?.can === true,
    disabledReceipts: () =>
      [AcqOrderStatus.PENDING, AcqOrderStatus.CANCELLED].some(s => s === store.order()?.status),
    canAddReceipt: () =>
      [AcqOrderStatus.ORDERED, AcqOrderStatus.PARTIALLY_RECEIVED].some(s => s === store.order()?.status),
  })),
  withMethods((store,
    acqOrderService = inject(AcqOrderApiService),
    acqReceiptService = inject(AcqReceiptApiService),
    recordPermissionService = inject(RecordPermissionService),
    appStore = inject(AppStore)
  ) => ({
    setFromRecord(record: any): void {
      if (record?.metadata?.pid) {
        patchState(store, { order: record.metadata });
      }
    },

    updateOrder(order: IAcqOrder): void {
      patchState(store, { order });
    },

    orderCreateInfoMessage(): string {
      return recordPermissionService.generateTooltipMessage(store.orderPermissions()?.create?.reasons, 'create');
    },

    receiptCreateInfoMessage(): string {
      return recordPermissionService.generateTooltipMessage(store.receiptPermissions()?.create?.reasons, 'create');
    },

    loadOrderPermissions: rxMethod<string>(
      pipe(
        filter(Boolean),
        switchMap(pid =>
          recordPermissionService.getPermission('acq_orders', pid).pipe(
            map(p => appStore.validateLibraryPermissions(p, store.order()?.library?.pid ?? '')),
            tap(orderPermissions => patchState(store, { orderPermissions })),
            catchError(() => EMPTY)
          )
        )
      )
    ),

    loadOrderLines: rxMethod<string>(
      pipe(
        filter(Boolean),
        switchMap(pid =>
          acqOrderService.getOrderLines(pid).pipe(
            tap(orderLines => patchState(store, { orderLines })),
            catchError(() => EMPTY)
          )
        )
      )
    ),

    loadReceipts: rxMethod<string>(
      pipe(
        filter(Boolean),
        switchMap(pid =>
          acqReceiptService.getReceiptsForOrder(pid).pipe(
            tap(receipts => patchState(store, { receipts })),
            catchError(() => EMPTY)
          )
        )
      )
    ),

    loadReceiptPermissions: rxMethod<string>(
      pipe(
        filter(Boolean),
        switchMap(pid =>
          recordPermissionService.getPermission('acq_orders', pid).pipe(
            map(p => appStore.validateLibraryPermissions(p, store.order()?.library?.pid ?? '')),
            map(p => validateReceivedOrderPermissions(p, store.order()!)),
            tap(receiptPermissions => patchState(store, { receiptPermissions })),
            catchError(() => EMPTY)
          )
        )
      )
    ),

    loadHistory: rxMethod<string>(
      pipe(
        filter(Boolean),
        switchMap(pid =>
          acqOrderService.getOrderHistory(pid).pipe(
            map(versions => versions.filter(Boolean).map(v => new AcqOrderHistoryVersion(v))),
            tap(historyVersions => patchState(store, { historyVersions })),
            catchError(() => EMPTY)
          )
        )
      )
    ),

    reloadOrder: rxMethod<string | null | undefined>(
      pipe(
        filter((pid): pid is string => !!pid),
        switchMap(pid =>
          acqOrderService.getOrder(pid, 1).pipe(
            tap(order => patchState(store, { order })),
            catchError(() => EMPTY)
          )
        )
      )
    ),
  })),
  withHooks((store) => {
    const acqOrderService = inject(AcqOrderApiService);
    const acqReceiptService = inject(AcqReceiptApiService);
    const orderPid = computed(() => store.order()?.pid);
    return {
      onInit: () => {
        // Load all sub-state when the order pid changes (not on every order mutation).
        effect(() => {
          const pid = orderPid();
          if (!pid) return;
          store.loadOrderPermissions(pid);
          store.loadOrderLines(pid);
          store.loadReceipts(pid);
          store.loadReceiptPermissions(pid);
          store.loadHistory(pid);
        });

        // Remove deleted order line from state optimistically.
        effect(() => {
          const line = acqOrderService.lastDeletedOrderLine();
          if (!line) return;
          patchState(store, {
            orderLines: untracked(() => store.orderLines()).filter(l => l.pid !== line.pid),
          });
        });

        // Remove deleted receipt from state and reload the order to refresh financial data.
        effect(() => {
          const receipt = acqReceiptService.lastDeletedReceipt();
          if (!receipt) return;
          patchState(store, {
            receipts: untracked(() => store.receipts()).filter(r => r.pid !== receipt.pid),
          });
          store.reloadOrder(untracked(() => store.order()?.pid));
        });
      },
    };
  })
);
