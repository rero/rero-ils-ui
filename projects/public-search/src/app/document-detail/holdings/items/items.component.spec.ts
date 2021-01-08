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
import { ItemService } from '../../../api/item.service';
import { ItemsComponent } from './items.component';


describe('ItemComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;

  const recordServiceSpy = jasmine.createSpyObj('ItemService', [
    'getItemsTotalByHoldingsPidAndViewcode',
    'getItemsByHoldingsPidAndViewcode'
  ]);
  recordServiceSpy.getItemsTotalByHoldingsPidAndViewcode.and.returnValue(of(10));
  recordServiceSpy.getItemsByHoldingsPidAndViewcode.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      declarations: [ ItemsComponent ],
      providers: [
        { provide: ItemService, useValue: recordServiceSpy }
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
    component.holdingpid = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the link more items', () => {
    component.itemsTotal = 10;
    fixture.detectChanges();
    const showMore = fixture.nativeElement.querySelector('#show-more-1');
    expect(showMore.textContent).toBeTruthy('Show more items…');
  });

  it('should don\'t display the link more items', () => {
    component.itemsTotal = 4;
    fixture.detectChanges();
    const showMore = fixture.nativeElement.querySelector('#show-more-1');
    expect(showMore).toBeNull();
  });
});
