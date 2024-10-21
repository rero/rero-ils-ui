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
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IssueItemStatus } from '@rero/shared';
import { IssueEmailComponent } from '../components/issues/issue-email/issue-email.component';
import { PreviewEmailModule } from '../shared/preview-email/preview-email.module';
import { IssueService } from './issue.service';

describe('IssueService', () => {
  let service: IssueService;

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
      ],
      providers: [
        PreviewEmailModule,
        CommonModule,
        IssueService
      ]
    });
    service = TestBed.inject(IssueService);
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
  });
});
