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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CallbackArrayFilterPipe, CoreModule } from '@rero/ng-core';
import { AppModule } from '../../../../app.module';
import { DocumentProvisionActivityPipe } from '../../../../pipe/document-provision-activity.pipe';
import { DocumentDescriptionComponent } from './document-description.component';


describe('DocumentDescriptionComponent', () => {
  let component: DocumentDescriptionComponent;
  let fixture: ComponentFixture<DocumentDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentDescriptionComponent ],
      imports: [
        AppModule,
        CoreModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        CallbackArrayFilterPipe,
        DocumentProvisionActivityPipe
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDescriptionComponent);
    component = fixture.componentInstance;
    component.record = {
      metadata: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
