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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ItemApiService } from '../../api/item-api.service';
import { QueryResponse } from '../../record';
import { BookComponent } from './book.component';


describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;

  const records: QueryResponse = {
    total: {
      value: 10,
      relation: 'eq'
    },
    hits: []
  };

  const recordServiceSpy = jasmine.createSpyObj('ItemService', [
    'getItemsByDocumentPidAndViewcode'
  ]);
  recordServiceSpy.getItemsByDocumentPidAndViewcode.and.returnValue(of(records));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ BookComponent ],
      providers: [
        { provide: ItemApiService, useValue: recordServiceSpy }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
    component.documentpid = '1';
    component.viewcode = 'global';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the link more items', () => {
    component.itemsTotal = 10;
    fixture.detectChanges();
    const showMore = fixture.nativeElement.querySelector('#show-more-1');
    expect(showMore.textContent.trim()).toEqual('Show more');
  });

  it('should don\'t display the link more items', () => {
    component.itemsTotal = 4;
    fixture.detectChanges();
    const showMore = fixture.nativeElement.querySelector('#show-more-1');
    expect(showMore).toBeNull();
  });
});
