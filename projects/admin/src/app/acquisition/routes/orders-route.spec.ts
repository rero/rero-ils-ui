// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RecordData, RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { of } from 'rxjs';
import { AcqReceiptApiService } from '../api/acq-receipt-api.service';
import { IAcqReceipt } from '../classes/receipt';
import { RouteToolService } from '../../routes/route-tool.service';
import { OrdersRoute } from './orders-route';

describe('OrdersRoute', () => {
  const lastDeletedReceipt = signal<IAcqReceipt | null>(null);
  const permissions = {
    canRead: { can: true, message: '' },
    canUpdate: { can: true, message: '' },
    canDelete: { can: false, message: 'Order already sent.' },
  };
  const routeToolServiceSpy = {
    appStore: { canAccess: vi.fn() },
    apiService: { getExportEndpointByType: vi.fn() },
    permissions: vi.fn().mockReturnValue(of(permissions)),
  };

  beforeEach(() => {
    lastDeletedReceipt.set(null);
    routeToolServiceSpy.permissions.mockClear();
    TestBed.configureTestingModule({
      providers: [
        { provide: RouteToolService, useValue: routeToolServiceSpy },
        { provide: Location, useValue: {} },
        { provide: AppStore, useValue: {} },
        { provide: RecordService, useValue: {} },
        { provide: AcqReceiptApiService, useValue: { lastDeletedReceipt } },
      ],
    });
  });

  it('should reload order permissions after deleting one of its receipts', () => {
    const type = TestBed.runInInjectionContext(() => new OrdersRoute().getTypes()[0]);
    const record = { metadata: { pid: '1' } } as unknown as RecordData;
    const subscription = type.permissions!(record).subscribe();
    TestBed.tick();

    expect(routeToolServiceSpy.permissions).toHaveBeenCalledTimes(1);

    lastDeletedReceipt.set({ acq_order: { pid: '1' } } as IAcqReceipt);
    TestBed.tick();
    expect(routeToolServiceSpy.permissions).toHaveBeenCalledTimes(2);

    lastDeletedReceipt.set({ acq_order: { pid: '2' } } as IAcqReceipt);
    TestBed.tick();
    expect(routeToolServiceSpy.permissions).toHaveBeenCalledTimes(2);

    subscription.unsubscribe();
  });
});
