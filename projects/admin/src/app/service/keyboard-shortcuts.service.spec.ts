// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import { provideTranslateService } from '@ngx-translate/core';

import { KeyboardShortcutsService } from './keyboard-shortcuts.service';

describe('KeyboardShortcutsService', () => {
  let service: KeyboardShortcutsService;
  let hotkeys: HotkeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), KeyboardShortcutsService, HotkeysService, Router],
    });

    service = TestBed.inject(KeyboardShortcutsService);
    hotkeys = TestBed.inject(HotkeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have defined shortcuts', () => {
    service.initializeShortcuts();
    expect(hotkeys.getShortcuts().length > 0).toBe(true);
  });

  it('should define a shortcut to focus the result list search input', () => {
    service.initializeShortcuts();
    const shortcuts = hotkeys.getHotkeys();
    expect(shortcuts.some((shortcut) => shortcut.keys === 'q')).toBe(true);
  });

  it('should focus the search input with the q shortcut', () => {
    document.body.innerHTML = '<input id="search" />';
    const input = document.querySelector('#search') as HTMLInputElement;

    service.initializeShortcuts();
    document.documentElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));

    expect(document.activeElement).toBe(input);
  });
});
