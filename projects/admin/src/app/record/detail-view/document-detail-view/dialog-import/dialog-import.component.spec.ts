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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { DialogImportComponent } from './dialog-import.component';


describe('DialogImportComponent', () => {
  let component: DialogImportComponent;
  let fixture: ComponentFixture<DialogImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [ DialogImportComponent ],
      providers: [BsModalRef]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImportComponent);
    component = fixture.componentInstance;
    component.records = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
