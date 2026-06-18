// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LoanFixedDateService } from "./loan-fixed-date.service";
import { LocalStorageService } from "@rero/ng-core";
import { MenuStore } from "@app/admin/menu/store/menu.store";
import { vi } from "vitest";

describe('LoanFixedDateService', () => {
  let service: LoanFixedDateService;

  const menuStoreSpy = { } as any;
  menuStoreSpy.selectedLibrary = signal(null);
  menuStoreSpy.logoutCounter = signal(0);

  const localStorageMock = {
    has: vi.fn().mockReturnValue(false),
    isExpired: vi.fn().mockReturnValue(false),
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.has.mockReturnValue(false);

    TestBed.configureTestingModule({
      providers: [
        LoanFixedDateService,
        { provide: LocalStorageService, useValue: localStorageMock },
        { provide: MenuStore, useValue: menuStoreSpy }
      ]
    });

    service = TestBed.inject(LoanFixedDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the date as a string', () => {
    expect(service.hasValue()).toBe(false);

    const dateString = new Date().toISOString();
    service.set(dateString);
    expect(service.get()).toEqual(dateString);
  });

  it('should return undefined if the date has expired', () => {
    // minus 5 days
    const d = new Date();
    d.setDate(d.getDate() - 5);
    service.set(d.toISOString());
    expect(service.hasValue()).toBe(true);
    expect(service.get()).toBeUndefined();
  });
});
