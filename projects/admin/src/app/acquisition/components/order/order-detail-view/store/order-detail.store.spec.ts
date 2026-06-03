/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
 * Copyright (C) 2025 UCLouvain
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

import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { AcqOrderApiService } from '../../../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../../../api/acq-receipt-api.service';
import { RecordPermissionService } from '../../../../../service/record-permission.service';
import { AppStore } from '@rero/shared';
import { of, throwError } from 'rxjs';
import { AcqOrderHistoryVersion, AcqOrderLineStatus, AcqOrderStatus, IAcqOrder, IAcqOrderLine } from '../../../../classes/order';
import { IAcqReceipt } from '../../../../classes/receipt';
import { OrderDetailStore } from './order-detail.store';

describe('OrderDetailStore', () => {
  const lastDeletedOrderLine = signal<IAcqOrderLine | null>(null);
  const lastDeletedReceipt = signal<IAcqReceipt | null>(null);

  const mockOrder: IAcqOrder = {
    pid: '1',
    reference: 'ORD-001',
    priority: 0,
    status: AcqOrderStatus.PENDING,
    currency: 'CHF',
    order_date: new Date('2025-01-01'),
    account_statement: {
      provisional: { total_amount: 100, quantity: 2 },
      expenditure: { total_amount: 0, quantity: 0 },
    },
    vendor: { pid: 'vendor1' },
    is_current_budget: true,
    organisation: { pid: 'org1' },
    library: { pid: 'lib1' },
    notes: [],
  };

  const mockOrderLine: IAcqOrderLine = {
    pid: 'line1',
    status: AcqOrderLineStatus.APPROVED,
    priority: 0,
    quantity: 1,
    received_quantity: 0,
    amount: 50,
    discount_amount: 0,
    total_amount: 50,
    acq_account: { pid: 'acct1' },
    acq_order: { pid: '1' },
    document: { pid: 'doc1' },
    organisation: { pid: 'org1' },
    notes: [],
  };

  const mockReceipt: IAcqReceipt = {
    pid: 'receipt1',
    acq_order: { pid: '1' },
    amount_adjustments: [],
    quantity: 1,
    total_amount: 50,
    receipt_lines: [],
    organisation: { pid: 'org1' },
    notes: [],
  };

  const mockPermissions: RecordPermissions = {
    create: { can: true },
    delete: { can: true },
    list: { can: true },
    read: { can: true },
    update: { can: true },
  };

  const acqOrderServiceSpy = {
    getOrder: vi.fn(),
    getOrderLines: vi.fn(),
    getOrderHistory: vi.fn(),
    lastDeletedOrderLine,
  };

  const acqReceiptServiceSpy = {
    getReceiptsForOrder: vi.fn(),
    lastDeletedReceipt,
  };

  const recordPermissionServiceSpy = {
    getPermission: vi.fn(),
    generateTooltipMessage: vi.fn().mockReturnValue('tooltip message'),
  };

  const appStoreSpy = {
    currentLibraryPid: signal<string | null>('lib1'),
    validateLibraryPermissions: vi.fn().mockImplementation((p: RecordPermissions) => p),
  };

  const setupStore = () => {
    lastDeletedOrderLine.set(null);
    lastDeletedReceipt.set(null);
    acqOrderServiceSpy.getOrder.mockReturnValue(of(mockOrder));
    acqOrderServiceSpy.getOrderLines.mockReturnValue(of([mockOrderLine]));
    acqOrderServiceSpy.getOrderHistory.mockReturnValue(of([]));
    acqReceiptServiceSpy.getReceiptsForOrder.mockReturnValue(of([mockReceipt]));
    recordPermissionServiceSpy.getPermission.mockReturnValue(of({ ...mockPermissions }));
    recordPermissionServiceSpy.generateTooltipMessage.mockReturnValue('tooltip message');
    appStoreSpy.validateLibraryPermissions.mockImplementation((p: RecordPermissions) => p);

    TestBed.configureTestingModule({
      providers: [
        OrderDetailStore,
        { provide: AcqOrderApiService, useValue: acqOrderServiceSpy },
        { provide: AcqReceiptApiService, useValue: acqReceiptServiceSpy },
        { provide: RecordPermissionService, useValue: recordPermissionServiceSpy },
        { provide: AppStore, useValue: appStoreSpy },
      ],
    });
    return TestBed.inject(OrderDetailStore);
  };

  afterEach(() => vi.resetAllMocks());

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------
  describe('initial state', () => {
    it('should have undefined order', () => {
      const store = setupStore();
      expect(store.order()).toBeUndefined();
    });

    it('should have empty arrays', () => {
      const store = setupStore();
      expect(store.orderLines()).toEqual([]);
      expect(store.receipts()).toEqual([]);
      expect(store.historyVersions()).toEqual([]);
    });

    it('should have undefined permissions', () => {
      const store = setupStore();
      expect(store.orderPermissions()).toBeUndefined();
      expect(store.receiptPermissions()).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // setFromRecord
  // ---------------------------------------------------------------------------
  describe('setFromRecord', () => {
    it('should set order when record has pid', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      expect(store.order()).toEqual(mockOrder);
    });

    it('should not update when record has no pid', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { reference: 'no-pid' } });
      expect(store.order()).toBeUndefined();
    });

    it('should not update when record is null', () => {
      const store = setupStore();
      store.setFromRecord(null);
      expect(store.order()).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // updateOrder
  // ---------------------------------------------------------------------------
  describe('updateOrder', () => {
    it('should replace the order', () => {
      const store = setupStore();
      const updated = { ...mockOrder, status: AcqOrderStatus.ORDERED };
      store.updateOrder(updated);
      expect(store.order()?.status).toBe(AcqOrderStatus.ORDERED);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: canPlaceOrder
  // ---------------------------------------------------------------------------
  describe('canPlaceOrder', () => {
    it('should be true when PENDING and provisional amount > 0', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      expect(store.canPlaceOrder()).toBe(true);
    });

    it('should be false when PENDING but provisional amount is 0', () => {
      const store = setupStore();
      store.setFromRecord({
        metadata: {
          ...mockOrder,
          account_statement: { provisional: { total_amount: 0, quantity: 0 }, expenditure: { total_amount: 0, quantity: 0 } },
        },
      });
      expect(store.canPlaceOrder()).toBe(false);
    });

    it('should be false when status is not PENDING', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { ...mockOrder, status: AcqOrderStatus.ORDERED } });
      expect(store.canPlaceOrder()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: canAddLine
  // ---------------------------------------------------------------------------
  describe('canAddLine', () => {
    it('should be true when PENDING and update permission is granted', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      TestBed.inject(OrderDetailStore); // flush
      store['loadOrderPermissions']('1');
      TestBed.tick();
      expect(store.canAddLine()).toBe(true);
    });

    it('should be false when status is not PENDING', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { ...mockOrder, status: AcqOrderStatus.ORDERED } });
      expect(store.canAddLine()).toBe(false);
    });

    it('should be false when update permission is denied', () => {
      const store = setupStore();
      recordPermissionServiceSpy.getPermission.mockReturnValue(of({ ...mockPermissions, update: { can: false } }));
      store.setFromRecord({ metadata: mockOrder });
      store['loadOrderPermissions']('1');
      expect(store.canAddLine()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: disabledReceipts
  // ---------------------------------------------------------------------------
  describe('disabledReceipts', () => {
    it('should be true when order is PENDING', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { ...mockOrder, status: AcqOrderStatus.PENDING } });
      expect(store.disabledReceipts()).toBe(true);
    });

    it('should be true when order is CANCELLED', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { ...mockOrder, status: AcqOrderStatus.CANCELLED } });
      expect(store.disabledReceipts()).toBe(true);
    });

    it('should be false when order is ORDERED', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { ...mockOrder, status: AcqOrderStatus.ORDERED } });
      expect(store.disabledReceipts()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: canAddReceipt
  // ---------------------------------------------------------------------------
  describe('canAddReceipt', () => {
    it('should be true when order is ORDERED', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { ...mockOrder, status: AcqOrderStatus.ORDERED } });
      expect(store.canAddReceipt()).toBe(true);
    });

    it('should be true when order is PARTIALLY_RECEIVED', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { ...mockOrder, status: AcqOrderStatus.PARTIALLY_RECEIVED } });
      expect(store.canAddReceipt()).toBe(true);
    });

    it('should be false when order is PENDING', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      expect(store.canAddReceipt()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Info message methods
  // ---------------------------------------------------------------------------
  describe('orderCreateInfoMessage', () => {
    it('should delegate to recordPermissionService.generateTooltipMessage', () => {
      const store = setupStore();
      store['loadOrderPermissions']('1');
      const result = store.orderCreateInfoMessage();
      expect(recordPermissionServiceSpy.generateTooltipMessage).toHaveBeenCalledWith(
        mockPermissions.create.reasons,
        'create'
      );
      expect(result).toBe('tooltip message');
    });
  });

  describe('receiptCreateInfoMessage', () => {
    it('should delegate to recordPermissionService.generateTooltipMessage', () => {
      const store = setupStore();
      store['loadReceiptPermissions']('1');
      const result = store.receiptCreateInfoMessage();
      expect(recordPermissionServiceSpy.generateTooltipMessage).toHaveBeenCalledWith(
        undefined,
        'create'
      );
      expect(result).toBe('tooltip message');
    });
  });

  // ---------------------------------------------------------------------------
  // loadOrderLines
  // ---------------------------------------------------------------------------
  describe('loadOrderLines', () => {
    it('should populate orderLines on success', () => {
      const store = setupStore();
      store['loadOrderLines']('1');
      expect(store.orderLines()).toEqual([mockOrderLine]);
    });

    it('should keep state empty on error', () => {
      const store = setupStore();
      acqOrderServiceSpy.getOrderLines.mockReturnValue(throwError(() => new Error('fail')));
      store['loadOrderLines']('1');
      expect(store.orderLines()).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // loadReceipts
  // ---------------------------------------------------------------------------
  describe('loadReceipts', () => {
    it('should populate receipts on success', () => {
      const store = setupStore();
      store['loadReceipts']('1');
      expect(store.receipts()).toEqual([mockReceipt]);
    });
  });

  // ---------------------------------------------------------------------------
  // loadHistory
  // ---------------------------------------------------------------------------
  describe('loadHistory', () => {
    it('should populate historyVersions with AcqOrderHistoryVersion instances', () => {
      const store = setupStore();
      const rawVersion = { $ref: '/api/acq_orders/2', label: 'v1', description: '', created: new Date(), updated: new Date(), current: true };
      acqOrderServiceSpy.getOrderHistory.mockReturnValue(of([rawVersion]));
      store['loadHistory']('1');
      expect(store.historyVersions().length).toBe(1);
      expect(store.historyVersions()[0]).toBeInstanceOf(AcqOrderHistoryVersion);
    });

    it('should start with empty historyVersions', () => {
      const store = setupStore();
      expect(store.historyVersions()).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // loadOrderPermissions
  // ---------------------------------------------------------------------------
  describe('loadOrderPermissions', () => {
    it('should call validateLibraryPermissions and update state', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      store['loadOrderPermissions']('1');
      expect(appStoreSpy.validateLibraryPermissions).toHaveBeenCalled();
      expect(store.orderPermissions()).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // loadReceiptPermissions
  // ---------------------------------------------------------------------------
  describe('loadReceiptPermissions', () => {
    it('should apply both validators and update receiptPermissions', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      store['loadReceiptPermissions']('1');
      expect(appStoreSpy.validateLibraryPermissions).toHaveBeenCalled();
      expect(store.receiptPermissions()).toBeDefined();
    });

    it('should disable create when order is RECEIVED', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: { ...mockOrder, status: AcqOrderStatus.RECEIVED } });
      store['loadReceiptPermissions']('1');
      expect(store.receiptPermissions()?.create?.can).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // reloadOrder
  // ---------------------------------------------------------------------------
  describe('reloadOrder', () => {
    it('should fetch order and update state', () => {
      const store = setupStore();
      const reloaded = { ...mockOrder, reference: 'UPDATED' };
      acqOrderServiceSpy.getOrder.mockReturnValue(of(reloaded));
      store['reloadOrder']('1');
      expect(acqOrderServiceSpy.getOrder).toHaveBeenCalledWith('1', 1);
      expect(store.order()?.reference).toBe('UPDATED');
    });

    it('should not call getOrder when pid is null', () => {
      const store = setupStore();
      store['reloadOrder'](null);
      expect(acqOrderServiceSpy.getOrder).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Hook: order change → load all sub-state
  // ---------------------------------------------------------------------------
  describe('effect: order change', () => {
    it('should call all load methods when order is set', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      TestBed.tick();
      expect(acqOrderServiceSpy.getOrderLines).toHaveBeenCalledWith('1');
      expect(acqReceiptServiceSpy.getReceiptsForOrder).toHaveBeenCalledWith('1');
      expect(acqOrderServiceSpy.getOrderHistory).toHaveBeenCalledWith('1');
      expect(recordPermissionServiceSpy.getPermission).toHaveBeenCalledWith('acq_orders', '1');
    });

    it('should not call load methods when order has no pid', () => {
      setupStore();
      TestBed.tick();
      expect(acqOrderServiceSpy.getOrderLines).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Hook: deleted order line
  // ---------------------------------------------------------------------------
  describe('effect: deleted order line', () => {
    it('should remove the deleted line from orderLines', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      TestBed.tick(); // let order-change effect run first
      expect(store.orderLines()).toEqual([mockOrderLine]);

      lastDeletedOrderLine.set(mockOrderLine);
      TestBed.tick();
      expect(store.orderLines()).toEqual([]);
    });

    it('should leave account_statement unchanged (server reload will update it)', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      TestBed.tick();

      lastDeletedOrderLine.set(mockOrderLine);
      TestBed.tick();
      expect(store.order()?.account_statement.provisional.total_amount).toBe(100);
    });
  });

  // ---------------------------------------------------------------------------
  // Hook: deleted receipt
  // ---------------------------------------------------------------------------
  describe('effect: deleted receipt', () => {
    it('should remove the deleted receipt from receipts', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      TestBed.tick(); // let order-change effect run first
      expect(store.receipts()).toEqual([mockReceipt]);

      lastDeletedReceipt.set(mockReceipt);
      TestBed.tick();
      expect(store.receipts()).toEqual([]);
    });

    it('should call reloadOrder after receipt deletion', () => {
      const store = setupStore();
      store.setFromRecord({ metadata: mockOrder });
      TestBed.tick(); // let order-change effect run first
      vi.clearAllMocks(); // reset call counts before the deletion
      acqOrderServiceSpy.getOrder.mockReturnValue(of(mockOrder));

      lastDeletedReceipt.set(mockReceipt);
      TestBed.tick();
      expect(acqOrderServiceSpy.getOrder).toHaveBeenCalledWith('1', 1);
    });
  });
});
