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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgVarDirective } from '../../../directive/ng-var.directive';
import { ContributionTypePipe } from '../../../pipe/contribution-type.pipe';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';
import { ContributionSourcesComponent } from '../contribution-sources/contribution-sources.component';
import { OrganisationBriefComponent } from './organisation-brief.component';


describe('OrganisationBriefComponent', () => {
  let component: OrganisationBriefComponent;
  let fixture: ComponentFixture<OrganisationBriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CommonModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      declarations: [
        ContributionSourcesComponent,
        OrganisationBriefComponent,
        ExtractSourceFieldPipe,
        NgVarDirective,
        ContributionTypePipe
      ],
      providers: [
        ExtractSourceFieldPipe,
        ContributionTypePipe,
        NgVarDirective
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
