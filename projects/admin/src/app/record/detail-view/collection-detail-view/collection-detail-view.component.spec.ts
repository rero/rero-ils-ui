
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
import { Nl2brPipe, RecordModule } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { AppRoutingModule } from '../../../app-routing.module';
import { FrontpageBoardComponent } from '../../../widgets/frontpage/frontpage-board/frontpage-board.component';
import { FrontpageComponent } from '../../../widgets/frontpage/frontpage.component';
import { CollectionDetailViewComponent } from './collection-detail-view.component';
import { CollectionItemsComponent } from './collection-items/collection-items.component';

describe('CollectionDetailViewComponent', () => {
  let component: CollectionDetailViewComponent;
  let fixture: ComponentFixture<CollectionDetailViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CollectionDetailViewComponent,
        CollectionItemsComponent,
        FrontpageComponent,
        FrontpageBoardComponent
      ],
      imports: [
        RecordModule,
        AppRoutingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        Nl2brPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
