// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { DialogService } from '@openng/optimus-ui/dynamicdialog';
import { RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { of } from 'rxjs';

import { ItemsService } from '../../service/items.service';
import { PatronService } from '../../service/patron.service';
import { CheckinComponent } from './checkin.component';

describe('CheckinComponent', () => {
  let component: CheckinComponent;
  const messageService = { add: vi.fn() };
  const recordService = { getRecords: vi.fn() };
  const itemsService = { checkin: vi.fn() };

  const searchResult = (total: number) => of({ hits: { total, hits: [] } });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: DialogService, useValue: {} },
        { provide: AppStore, useValue: { currentOrganisationPid: () => '1', currentLibraryPid: () => '2' } },
        { provide: RecordService, useValue: recordService },
        { provide: ItemsService, useValue: itemsService },
        { provide: Router, useValue: {} },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
        { provide: PatronService, useValue: {} },
      ],
    });
    component = TestBed.runInInjectionContext(() => new CheckinComponent());
  });

  afterEach(() => vi.resetAllMocks());

  it('should search the items of the current organisation only', () => {
    recordService.getRecords.mockReturnValue(searchResult(0));
    component.getPatronOrItem('123');
    expect(recordService.getRecords).toHaveBeenCalledWith('items', {
      query: 'barcode:123 AND organisation.pid:1',
      page: 1,
      itemsPerPage: 1,
    });
  });

  it('should display a message when neither a patron nor an item is found', () => {
    recordService.getRecords.mockReturnValue(searchResult(0));
    component.getPatronOrItem('123');
    expect(messageService.add).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Item or patron not found!' }));
  });

  it('should add the checked-in item to the list', () => {
    const item = { barcode: '123' };
    itemsService.checkin.mockReturnValue(of(item));
    component.checkin('123');
    expect(component.items()).toEqual([item]);
  });

  it('should display a message and restore the barcode entry when the checkin finds no item', async () => {
    itemsService.checkin.mockReturnValue(of(null));
    component.checkin('123');
    expect(messageService.add).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Item or patron not found!' }));
    expect(component.items()).toEqual([]);
    expect(component.searchInputDisabled()).toBe(false);
    await new Promise((resolve) => setTimeout(resolve));
    expect(component.searchInputFocus()).toBe(true);
  });
});
