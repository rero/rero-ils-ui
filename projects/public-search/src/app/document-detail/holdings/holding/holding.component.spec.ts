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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { GetTranslatedLabelPipe } from '@rero/shared';
import { NotesFilterPipe } from '../../../pipe/notes-filter.pipe';
import { HoldingComponent } from './holding.component';


describe('HoldingComponent', () => {
  let component: HoldingComponent;
  let fixture: ComponentFixture<HoldingComponent>;

  const record = {
    metadata: {
      pid: '1',
      library: {
        name: 'library name'
      },
      location: {
        name: 'location name'
      },
      circulation_category: {
        name: 'default'
      },
      holdings_type: 'serial',
      available: true,
      call_number: 'F123456',
      second_call_number: 'S123456',
      enumerationAndChronology: 'enum and chro',
      supplementaryContent: 'sup content',
      index: 'record index',
      missing_issues: 'missing',
      notes: [
        { type: 'general_note', content: 'public note' }
      ]
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CoreModule
      ],
      declarations: [ HoldingComponent, NotesFilterPipe, GetTranslatedLabelPipe],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingComponent);
    component = fixture.componentInstance;
    component.holding = record;
    component.itemsCount = 5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all data into the template', () => {
    let data = fixture.nativeElement.querySelector('#holding-location-1');
    expect(data.textContent).toBeTruthy('library name: location name');

    data = fixture.nativeElement.querySelector('#holding-category-name-1');
    expect(data.textContent).toBeTruthy('default');

    data = fixture.nativeElement.querySelector('#holding-category-name-1');
    expect(data.textContent).toBeTruthy('default');

    component.isCollapsed = true;
    data = fixture.nativeElement.querySelector('#holding-available-1');
    expect(data.textContent).toBeTruthy('see collections and items');

    data = fixture.nativeElement.querySelector('#holding-call-number-1');
    expect(data.textContent).toBeTruthy('F123456 | S123456');

    data = fixture.nativeElement.querySelector('#holding-enum-chro-1');
    expect(data.textContent).toBeTruthy('enum and chro');

    data = fixture.nativeElement.querySelector('#holding-sup-content-1');
    expect(data.textContent).toBeTruthy('sup content');

    data = fixture.nativeElement.querySelector('#holding-index-1');
    expect(data.textContent).toBeTruthy('record index');

    data = fixture.nativeElement.querySelector('#holding-missing-issues-1');
    expect(data.textContent).toBeTruthy('missing');

    data = fixture.nativeElement.querySelector('#holding-note-1');
    expect(data.textContent).toBeTruthy('public note');
  });
});
