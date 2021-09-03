/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoldingSharedViewComponent } from './holding-shared-view.component';

describe('HoldingSharedViewComponent', () => {
  let component: HoldingSharedViewComponent;
  let fixture: ComponentFixture<HoldingSharedViewComponent>;

  const record = {
    metadata: {
      pid: 1,
      call_number: 'A11111',
      enumerationAndChronology: 'enum',
      supplementaryContent: 'supp',
      index: 'index field'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoldingSharedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingSharedViewComponent);
    component = fixture.componentInstance;
    component.holding = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the call number field', () => {
    const data = fixture.nativeElement.querySelector('#holding-call-number-1');
    expect(data.textContent).toContain('A11111');
  });

  it('should display the enumeration and chronology field', () => {
    const data = fixture.nativeElement.querySelector('#holding-enum-chrono-1');
    expect(data.textContent).toContain('enum');
  });

  it('should display the enumeration and chronology field', () => {
    const data = fixture.nativeElement.querySelector('#holding-sup-content-1');
    expect(data.textContent).toContain('supp');
  });

  it('should display the index field', () => {
    const data = fixture.nativeElement.querySelector('#holding-index-1');
    expect(data.textContent).toContain('index field');
  });
});
