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
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { OperationLogsDialogComponent } from './operation-logs-dialog.component';


describe('OperationLogsDialogComponent', () => {
  let component: OperationLogsDialogComponent;
  let fixture: ComponentFixture<OperationLogsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationLogsDialogComponent ],
      providers: [
        BsModalRef,
        BsModalService,
        ComponentLoaderFactory,
        PositioningService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationLogsDialogComponent);
    component = fixture.componentInstance;
    component.resourceType = 'documents';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display operation history button', () => {
    const data = fixture.nativeElement.querySelector('#documents-operation-history');
    expect(data.textContent).toContain('Operation history');
  });
});
