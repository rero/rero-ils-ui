/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

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
    translateService.setTranslation('en', {
      'Order status is {{status}}': 'Order status is {{status}}'
    });
    translateService.setTranslation('fr', {
      'You cannot delete the record for the following reasons:': 'Vous ne pouvez pas supprimer l\'enregistrement pour les raisons suivantes:',
      'Order status is {{status}}': 'Le statut de la commande est {{status}}',
      'has {{value}} items with {{name}} attached': 'contient {{value}} exemplaires avec {{name}} attaché',
      'ordered': 'commandé',
      'fees': 'frais'
    });
    translateService.use('en');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the list of permissions', () => {
    httpClientSpy.get.and.returnValue(of(testRecordPermission));
    service.getPermission('documents')
      .subscribe((result: RecordPermissions) => expect(result).toEqual(testRecordPermission))
    expect(service).toBeTruthy();
  });

  it('should return permission roles', () => {
    httpClientSpy.get.and.returnValue(of(testRolesPermissions));
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
    const user = {
      currentLibrary: '1'
    };
    const permissions = {...testRecordPermission};
    const membershipPermissions = {...testRecordPermission, ...{
      update: { can: false },
      delete: { can: false, reasons: { others: { record_not_in_current_library : '' }}}
    }}
    // the user's library is different from the current library
    expect(service.membership(user, '2', permissions)).toEqual(membershipPermissions);
    // the user's library is the same as the current Library
    expect(service.membership(user, '1', permissions)).toEqual(permissions);
  });

  it('should translate the message object with dynamic data', () => {
    const reasons = {
      others: {
        message: 'Order status is {{status}}',
        data: {
          status: 'ordered'
        }
      }
    };
    const message = [
      'You cannot delete the record for the following reason:',
      '- Order status is ordered'
    ].join('<br>');
    expect(service.generateTooltipMessage(reasons, 'delete')).toEqual(message);
  });

  it('should translate the message object with dynamic data', () => {
    translateService.use('fr');
    const reasons = {
      others: [
        {
          message: 'Order status is {{status}}',
          data: {
            status: 'ordered'
          }
        },
        {
          message: 'has {{value}} items with {{name}} attached',
          data: {
            value: 3,
            name: 'fees'
          }
        }
      ]
    };
    const message = [
      'Vous ne pouvez pas supprimer l\'enregistrement pour les raisons suivantes:',
      '- Le statut de la commande est commandé',
      '- contient 3 exemplaires avec frais attaché'
    ].join('<br>');
    expect(service.generateTooltipMessage(reasons, 'delete')).toEqual(message);
  });
});
