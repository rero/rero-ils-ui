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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule } from '@rero/ng-core';
import { AppRoutingModule } from 'projects/admin/src/app/app-routing.module';
import { FrontpageBoardComponent } from 'projects/admin/src/app/widgets/frontpage/frontpage-board/frontpage-board.component';
import { FrontpageComponent } from 'projects/admin/src/app/widgets/frontpage/frontpage.component';
import { NgVarDirective } from '../../../directive/ng-var.directive';
import { ContributionTypePipe } from '../../../pipe/contribution-type.pipe';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';
import { IdAttributePipe } from '../../../pipe/id-attribute.pipe';
import { UrlActivePipe } from '../../../pipe/url-active.pipe';
import { ContributionSourcesComponent } from '../contribution-sources/contribution-sources.component';
import { PersonBriefComponent } from './person-brief.component';


describe('PersonBriefComponent', () => {
  let component: PersonBriefComponent;
  let fixture: ComponentFixture<PersonBriefComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PersonBriefComponent,
        ContributionSourcesComponent,
        ExtractSourceFieldPipe,
        FrontpageComponent,
        FrontpageBoardComponent,
        UrlActivePipe,
        IdAttributePipe,
        ContributionTypePipe,
        NgVarDirective
      ],
      imports: [
        RecordModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        AppRoutingModule
      ],
      providers: [
        DatePipe,
        ExtractSourceFieldPipe,
        ContributionTypePipe,
        UrlActivePipe,
        NgVarDirective,
        IdAttributePipe
      ]
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
