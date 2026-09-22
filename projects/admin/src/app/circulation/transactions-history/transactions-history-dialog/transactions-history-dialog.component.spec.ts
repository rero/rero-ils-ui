// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { TransactionsHistoryDialogComponent } from './transactions-history-dialog.component';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER = {
  fullname: 'Muller, Astrid',
  patronLibrarian: { pid: 'patron-1' },
} as any;

// ─── Mocks ────────────────────────────────────────────────────────────────────

const appStoreMock = {
  user: vi.fn().mockReturnValue(USER),
};

describe('TransactionsHistoryDialogComponent', () => {
  let component: TransactionsHistoryDialogComponent;
  let fixture: ComponentFixture<TransactionsHistoryDialogComponent>;
  let dialogService: DialogService;

  beforeEach(async () => {
    vi.clearAllMocks();
    appStoreMock.user.mockReturnValue(USER);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DynamicDialogModule, TransactionsHistoryDialogComponent],
      providers: [
        provideNoopAnimations(),
        DialogService,
        { provide: AppStore, useValue: appStoreMock },
      ],
    }).compileComponents();

    dialogService = TestBed.inject(DialogService);
    fixture = TestBed.createComponent(TransactionsHistoryDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the label from the "Operation history" translation and the user full name', () => {
    expect(component['label']()).toBe('Operation history (Muller, Astrid)');
  });

  describe('openDialog()', () => {
    it('should open the dialog with the patron librarian pid as userPid', () => {
      const openSpy = vi.spyOn(dialogService, 'open');

      component.openDialog();

      expect(openSpy).toHaveBeenCalledTimes(1);
      const [, config] = openSpy.mock.calls[0];
      expect(config.inputValues).toEqual({ userPid: 'patron-1' });
    });

    it('should pass the label as the dialog header', () => {
      const openSpy = vi.spyOn(dialogService, 'open');

      component.openDialog();

      const [, config] = openSpy.mock.calls[0];
      expect(config.header).toBe('Operation history (Muller, Astrid)');
    });

    it('should close the dialog when the loaded component emits closeRequested', () => {
      const onChildComponentLoaded = new Subject<any>();
      const closeSpy = vi.fn();
      vi.spyOn(dialogService, 'open').mockReturnValue({
        onChildComponentLoaded,
        close: closeSpy,
      } as any);

      component.openDialog();

      const closeRequested = new Subject<void>();
      onChildComponentLoaded.next({ closeRequested });
      closeRequested.next();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not throw when dialogService.open returns null', () => {
      vi.spyOn(dialogService, 'open').mockReturnValue(null);
      expect(() => component.openDialog()).not.toThrow();
    });
  });
});
