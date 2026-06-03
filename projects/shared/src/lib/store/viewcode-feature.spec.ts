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
