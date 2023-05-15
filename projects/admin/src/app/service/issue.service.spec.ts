/*
 * RERO ILS UI
 * Copyright (C) 2022-2023 RERO
 * Copyright (C) 2022-2023 UCLouvain
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
import { TestBed } from '@angular/core/testing';
import { IssueService } from './issue.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IssueItemStatus } from '@rero/shared';
import { IssueEmailComponent } from '../components/issues/issue-email/issue-email.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PreviewEmailModule } from '../shared/preview-email/preview-email.module';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

describe('IssueService', () => {
  let service: IssueService;
  let modalService: BsModalService;

  const record = {
    metadata: {
      pid: '1'
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        IssueEmailComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot()
      ],
      providers: [
        PreviewEmailModule,
        CommonModule,
        BsModalService,
        BsLocaleService,
        IssueService
      ]
    });
    service = TestBed.inject(IssueService);
    modalService = TestBed.inject(BsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return if claim is authorized or not', () => {
    [IssueItemStatus.DELETED, IssueItemStatus.RECEIVED]
      .forEach(element => expect(service.isClaimAllowed(element)).toBeFalse());
    [IssueItemStatus.EXPECTED, IssueItemStatus.LATE]
      .forEach(element => expect(service.isClaimAllowed(element)).toBeTrue());
  });

  it('should return the modal reference', () => {
    const modal = service.openClaimEmailDialog(record);
    expect(modal).toBeInstanceOf(BsModalRef);
    modalService.hide();
  });
});
