/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
    expect(hotkeys.getShortcuts().length > 0).toBeTrue();
  });
});
