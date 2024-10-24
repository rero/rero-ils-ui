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
import { DateTranslatePipe, Nl2brPipe } from '@rero/ng-core';
import { AppRoutingModule } from '../app-routing.module';
import { ErrorPageComponent } from '../error/error-page.component';
import { MainComponent } from '../main/main.component';
import { CollectionBriefComponent } from './collection-brief.component';


describe('CollectionBriefComponent', () => {
  let component: CollectionBriefComponent;
  let fixture: ComponentFixture<CollectionBriefComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainComponent,
        CollectionBriefComponent,
        DateTranslatePipe,
        Nl2brPipe,
        ErrorPageComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        AppRoutingModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
