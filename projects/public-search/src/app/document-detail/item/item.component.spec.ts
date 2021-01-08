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
import { DateTranslatePipe, Nl2brPipe } from '@rero/ng-core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NotesFilterPipe } from '../../pipe/notes-filter.pipe';
import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

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
      availability: {
        request: 2,
        due_date: '2021-02-01 12:00:00'
      },
      barcode: 'B12222',
      holdings_type: 'book',
      available: true,
      call_number: 'F123456',
      enumerationAndChronology: 'enum and chro',
      supplementaryContent: 'sup content',
      index: 'record index',
      missing_issues: 'missing',
      notes: [
        { type: 'general_note', content: 'public note' }
      ],
      in_collection: [
        { pid: '1', viewcode: 'global', title: 'collection' }
      ],
      status: 'on_loan'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        ItemComponent,
        NotesFilterPipe,
        Nl2brPipe,
        DateTranslatePipe
      ],
      providers: [
        BsLocaleService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    component.context = 'book';
    component.item = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all data into the template', () => {
    let data = fixture.nativeElement.querySelector('#item-location-1');
    expect(data.textContent).toBeTruthy('library name: location name');

    data = fixture.nativeElement.querySelector('#item-call-number-1');
    expect(data.textContent).toBeTruthy('F123456');

    data = fixture.nativeElement.querySelector('#item-call-number-1');
    expect(data.textContent).toBeTruthy('F123456');

    data = fixture.nativeElement.querySelector('#item-location-temporary-1');
    expect(data.textContent).toBeTruthy('collection');

    data = fixture.nativeElement.querySelector('#item-enum-chrono-1');
    expect(data.textContent).toBeTruthy('enum and chro');

    data = fixture.nativeElement.querySelector('#item-barcode-1');
    expect(data.textContent).toBeTruthy('B12222');

    data = fixture.nativeElement.querySelector('#item-status-1');
    expect(data.textContent).toBeTruthy('due until 2/1/21 (2 requests)');
  });
});
