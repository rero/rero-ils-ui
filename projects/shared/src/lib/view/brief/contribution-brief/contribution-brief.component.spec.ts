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

 /* tslint:disable:no-unused-variable */

import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, Nl2brPipe } from '@rero/ng-core';
import { NgVarDirective } from '@rero/ng-core';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';
import { UrlActivePipe } from '../../../pipe/url-active.pipe';
import { ContributionSourcesComponent } from '../contribution-sources/contribution-sources.component';
import { OrganisationBriefComponent } from '../organisation-brief/organisation-brief.component';
import { PersonBriefComponent } from '../person-brief/person-brief.component';
import { ContributionBriefComponent } from './contribution-brief.component';


describe('ContributionBriefComponent', () => {
  let component: ContributionBriefComponent;
  let fixture: ComponentFixture<ContributionBriefComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        CoreModule
      ],
      declarations: [
        ContributionBriefComponent,
        ContributionSourcesComponent,
        PersonBriefComponent,
        OrganisationBriefComponent,
        ExtractSourceFieldPipe,
        UrlActivePipe,
        NgVarDirective
      ],
      providers: [
        ExtractSourceFieldPipe,
        Nl2brPipe,
        UrlActivePipe,
        NgVarDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributionBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
