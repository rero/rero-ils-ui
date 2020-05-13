/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule } from '@rero/ng-core';
import { AppRoutingModule } from 'projects/admin/src/app/app-routing.module';
import { FrontpageBoardComponent } from 'projects/admin/src/app/frontpage/frontpage-board/frontpage-board.component';
import { FrontpageComponent } from 'projects/admin/src/app/frontpage/frontpage.component';
import { BioInformationsPipe } from '../pipes/bio-informations.pipe';
import { BirthDatePipe } from '../pipes/birth-date.pipe';
import { MefTitlePipe } from '../pipes/mef-title.pipe';
import { PersonBriefComponent } from './person-brief.component';


describe('PersonBriefComponent', () => {
  let component: PersonBriefComponent;
  let fixture: ComponentFixture<PersonBriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PersonBriefComponent,
        MefTitlePipe,
        BirthDatePipe,
        BioInformationsPipe,
        FrontpageComponent,
        FrontpageBoardComponent
      ],
      imports:
      [
        RecordModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        AppRoutingModule
      ],
      providers: [DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
