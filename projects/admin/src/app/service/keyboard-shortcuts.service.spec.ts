// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { KeyboardShortcutsService } from "./keyboard-shortcuts.service";
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { HotkeysService } from "@ngneat/hotkeys";

describe('KeyboardShortcutsService', () => {
  let service: KeyboardShortcutsService;
  let hotkeys: HotkeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        KeyboardShortcutsService,
        HotkeysService,
        Router
      ]
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
});
