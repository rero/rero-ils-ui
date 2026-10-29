// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog';
import { MessageModule } from '@openng/optimus-ui/message';
import { IssueItemStatus } from '@rero/shared';

import { IssueEmailComponent } from '../components/issues/issue-email/issue-email.component';
import { IssueService } from './issue.service';

describe('IssueService', () => {
  let service: IssueService;

  const record = {
    metadata: {
      pid: '1',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DynamicDialogModule, MessageModule, IssueEmailComponent],
      providers: [
        provideTranslateService(),
        IssueService,
        DialogService,
        MessageService,
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(IssueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return if claim is authorized or not', () => {
    [IssueItemStatus.DELETED, IssueItemStatus.RECEIVED].forEach((element) =>
      expect(service.isClaimAllowed(element)).toBe(false),
    );
    [IssueItemStatus.EXPECTED, IssueItemStatus.LATE].forEach((element) =>
      expect(service.isClaimAllowed(element)).toBe(true),
    );
  });

  it('should return the modal reference', () => {
    expect(service.openClaimEmailDialog(record)).toBeInstanceOf(DynamicDialogRef);
  });
});
