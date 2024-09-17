/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { TranslateModule } from '@ngx-translate/core';
import { UserService, testUserPatronWithSettings } from '@rero/shared';
import { PatronProfilePersonalEditorComponent } from './patron-profile-personal-editor.component';


describe('PatronProfilePersonalEditorComponent', () => {
  let component: PatronProfilePersonalEditorComponent;
  let fixture: ComponentFixture<PatronProfilePersonalEditorComponent>;

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = testUserPatronWithSettings;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatronProfilePersonalEditorComponent ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FormlyPrimeNGModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfilePersonalEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
