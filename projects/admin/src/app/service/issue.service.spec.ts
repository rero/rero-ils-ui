// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { IssueItemStatus } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';
import { IssueEmailComponent } from '../components/issues/issue-email/issue-email.component';
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
    imports: [
        TranslateModule.forRoot(),
        DynamicDialogModule,
        MessageModule,
        IssueEmailComponent
    ],
    providers: [
        IssueService,
        DialogService,
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
    ]
});
    service = TestBed.inject(IssueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return if claim is authorized or not', () => {
    [IssueItemStatus.DELETED, IssueItemStatus.RECEIVED]
      .forEach(element => expect(service.isClaimAllowed(element)).toBe(false));
    [IssueItemStatus.EXPECTED, IssueItemStatus.LATE]
      .forEach(element => expect(service.isClaimAllowed(element)).toBe(true));
  });

  it('should return the modal reference', () => {
    expect(service.openClaimEmailDialog(record)).toBeInstanceOf(DynamicDialogRef);
  });
});
