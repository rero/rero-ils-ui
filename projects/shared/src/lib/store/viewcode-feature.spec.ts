// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { withViewCode } from './viewcode-feature';

const TestStore = signalStore(withViewCode());

describe('ViewCodeFeature', () => {
  let store: InstanceType<typeof TestStore>;

  beforeEach(() => {
    store = TestBed.configureTestingModule({
      providers: [TestStore]
    }).inject(TestStore);
  });

  it('should initialize with global view code', () => {
    expect(store.viewCode()).toBe('global');
  });

  it('should update viewCode when change() is called', () => {
    store.change('nj');
    expect(store.viewCode()).toBe('nj');
  });

  it('should allow switching between view codes', () => {
    store.change('nj');
    expect(store.viewCode()).toBe('nj');
    store.change('global');
    expect(store.viewCode()).toBe('global');
  });

  it('should accept any string as view code', () => {
    store.change('custom-view');
    expect(store.viewCode()).toBe('custom-view');
  });
});
