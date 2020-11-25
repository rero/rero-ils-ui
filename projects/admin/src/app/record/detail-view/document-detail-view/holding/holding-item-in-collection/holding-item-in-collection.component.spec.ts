/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from 'projects/admin/src/app/app-routing.module';
import { SharedModule } from '@rero/shared';
import { FrontpageBoardComponent } from '../../../../../widgets/frontpage/frontpage-board/frontpage-board.component';
import { FrontpageComponent } from '../../../../../widgets/frontpage/frontpage.component';
import { HoldingItemInCollectionComponent } from './holding-item-in-collection.component';

describe('HoldingItemInCollectionComponent', () => {
  let component: HoldingItemInCollectionComponent;
  let fixture: ComponentFixture<HoldingItemInCollectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        HoldingItemInCollectionComponent,
        FrontpageComponent,
        FrontpageBoardComponent
      ],
      imports: [
        HttpClientTestingModule,
        AppRoutingModule,
        TranslateModule.forRoot(),
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldingItemInCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
