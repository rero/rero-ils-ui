// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { testRecordPermission, testRolesPermissions } from "@rero/shared";
import { of } from "rxjs";
import { RecordPermissions } from "../classes/permissions";
import { RecordPermissionService } from "./record-permission.service";

describe('RecordPermissionService', () => {
  let service: RecordPermissionService;
  let translateService: TranslateService;

  const httpClientSpy = { get: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        RecordPermissionService,
        TranslateService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(RecordPermissionService);
    translateService = TestBed.inject(TranslateService);
    translateService.use('en');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the list of permissions', () => {
    httpClientSpy.get.mockReturnValue(of(testRecordPermission));
    service.getPermission('documents')
      .subscribe((result: RecordPermissions) => expect(result).toEqual(testRecordPermission))
    expect(service).toBeTruthy();
  });

  it('should return permission roles', () => {
    httpClientSpy.get.mockReturnValue(of(testRolesPermissions));
    service.getRolesManagementPermissions()
      .subscribe((result: any) => expect(result).toEqual(testRolesPermissions));
  });

  it('should return the message generated for the tooltip', () => {
    const reasons = {
      links: {
        acq_orders: '2'
      },
      others: {
        harvested: ''
      }
    };
    const message = [
      'You cannot operate the record for the following reasons:',
      '- 2 acquisition orders attached.',
      '- The record has been harvested.'
    ].join('<br>');
    expect(service.generateTooltipMessage(reasons, 'create')).toEqual(message);
  });

  it('should return the message generated for the delete', () => {
    const reasons = {
      links: {
        acq_orders: '3'
      }
    };
    const message = [
      'You cannot delete the record for the following reason:',
      '- 3 acquisition orders attached.'
    ].join('<br>');
    expect(service.generateTooltipMessage(reasons, 'delete')).toEqual(message);
  });

  it('should return a list of permissions based on the current library', () => {
    const permissions = {...testRecordPermission};
    const membershipPermissions = {...testRecordPermission, ...{
      update: { can: false },
      delete: { can: false, reasons: { others: { record_not_in_current_library : '' }}}
    }}
    // the current library is different from the record's library
    expect(service.membership('1', '2', permissions)).toEqual(membershipPermissions);
    // the current library matches the record's library
    expect(service.membership('1', '1', permissions)).toEqual(permissions);
  });
});
