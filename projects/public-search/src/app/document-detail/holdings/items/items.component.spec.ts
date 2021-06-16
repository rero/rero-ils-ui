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
import { CoreModule } from '@rero/ng-core';
import { of } from 'rxjs';
import { ItemApiService } from '../../../api/item-api.service';
import { QueryResponse } from '../../../record';
import { ItemsComponent } from './items.component';


describe('ItemComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;

  const records: QueryResponse = {
    total: {
      value: 10,
      relation: 'eq'
    },
    hits: []
  };

  const holding = {
    metadata: {
      pid: '1',
      holdings_type: 'regular'
    }
  };

  const recordServiceSpy = jasmine.createSpyObj('ItemService', [
    'getItemsByHoldingsAndViewcode'
  ]);
  recordServiceSpy.getItemsByHoldingsAndViewcode.and.returnValue(of(records));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      declarations: [ ItemsComponent ],
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
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    component.holding = holding;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Fix tests after release
  // it('should display the link more items', () => {
  //   component.itemsTotal = 10;
  //   fixture.detectChanges();
  //   const showMore = fixture.nativeElement.querySelector('#show-more-1');
  //   expect(showMore.textContent.trim()).toEqual('Show more');
  // });

  // it('should don\'t display the link more items', () => {
  //   component.itemsTotal = 4;
  //   fixture.detectChanges();
  //   const showMore = fixture.nativeElement.querySelector('#show-more-1');
  //   expect(showMore).toBeNull();
  // });
});
