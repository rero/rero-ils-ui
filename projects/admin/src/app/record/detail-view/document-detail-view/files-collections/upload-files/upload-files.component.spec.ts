// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { ResourcesFilesService } from '@app/admin/service/resources-files.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { UploadedFile, UploadFilesComponent } from './upload-files.component';

describe('UploadFilesComponent', () => {
  let component: UploadFilesComponent;

  const fileServiceSpy = { updateMetadata: vi.fn() };

  /** Build a fully typed file fixture, overriding only the relevant fields. */
  const createFile = (overrides: Partial<UploadedFile>): UploadedFile => ({
    key: 'test_file.pdf',
    label: '',
    created: '',
    updated: '',
    size: 0,
    metadata: null,
    links: {},
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UploadFilesComponent],
      providers: [
        { provide: ResourcesFilesService, useValue: fileServiceSpy },
        { provide: MessageService, useValue: { add: vi.fn() } },
        { provide: ConfirmationService, useValue: { confirm: vi.fn() } },
        { provide: NgxSpinnerService, useValue: { show: vi.fn(), hide: vi.fn() } },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    // do not trigger change detection: avoids rendering the template and running
    // the constructor effect (which would call getFiles).
    component = TestBed.createComponent(UploadFilesComponent).componentInstance;
    component.parentRecord.set({ id: 'recid', metadata: {} });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should send the label nested under metadata, never at the root', () => {
    // a file as returned by the server after a page reload: metadata holds the label
    const file = createFile({ label: 'old', metadata: { label: 'old' } });
    fileServiceSpy.updateMetadata.mockReturnValue(of({ metadata: { label: 'Café résumé' } }));

    component.updateLabel(file, 'Café résumé');

    const payload = fileServiceSpy.updateMetadata.mock.calls[0][2];
    expect(payload).toEqual({ metadata: { label: 'Café résumé' } });
    // the regression we are guarding against: no top-level `label`
    expect(payload).not.toHaveProperty('label');
  });

  it('should not call the service when the label is unchanged', () => {
    fileServiceSpy.updateMetadata.mockClear();
    const file = createFile({ label: 'same', metadata: { label: 'same' } });

    component.updateLabel(file, 'same');

    expect(fileServiceSpy.updateMetadata).not.toHaveBeenCalled();
  });
});
