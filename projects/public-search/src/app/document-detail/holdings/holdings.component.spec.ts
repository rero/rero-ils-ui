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
import { of } from 'rxjs';
import { HoldingsService } from '../../api/holdings.service';
import { HoldingsComponent } from './holdings.component';


describe('HoldingsComponent', () => {
  let component: HoldingsComponent;
  let fixture: ComponentFixture<HoldingsComponent>;

  const record = [
    {
      pid: '1'
    }
  ];
  const recordServiceSpy = jasmine.createSpyObj('HoldingsService', [
    'getHoldingsTotalByDocumentPidAndViewcode',
    'getHoldingsByDocumentPidAndViewcode'
  ]);
  recordServiceSpy.getHoldingsTotalByDocumentPidAndViewcode.and.returnValue(of(10));
  recordServiceSpy.getHoldingsByDocumentPidAndViewcode.and.returnValue(of(record));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CoreModule
      ],
      declarations: [ HoldingsComponent ],
      providers: [
        { provide: HoldingsService, useValue: recordServiceSpy }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingsComponent);
    component = fixture.componentInstance;
    component.documentpid = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the link more holdings', () => {
    component.holdingsTotal = 10;
    fixture.detectChanges();
    const showMore = fixture.nativeElement.querySelector('#show-more-1');
    expect(showMore.textContent).toBeTruthy('Show more holdings…');
  });

  it('should don\'t display the link more holdings', () => {
    component.holdingsTotal = 4;
    fixture.detectChanges();
    const showMore = fixture.nativeElement.querySelector('#show-more-1');
    expect(showMore).toBeNull();
  });
});
