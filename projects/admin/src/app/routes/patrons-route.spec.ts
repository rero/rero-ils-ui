// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7, RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { of } from 'rxjs';

import { PatronsRoute } from './patrons-route';
import { RouteToolService } from './route-tool.service';

describe('PatronsRoute libraries field', () => {
  const recordServiceSpy = { getRecords: vi.fn() };
  const routeToolServiceSpy = {
    appStore: { user: () => ({ patrons: [{ libraries: [{ pid: '1' }] }] }) },
    apiService: { getRefEndpoint: vi.fn() },
    recordService: recordServiceSpy,
  };
  const jsonSchema = { widget: { formlyConfig: { props: { fieldMap: 'libraries' } } } } as JSONSchema7;

  beforeEach(() => {
    recordServiceSpy.getRecords.mockReturnValue(of({ hits: { total: 0, hits: [] } }));
    TestBed.configureTestingModule({
      providers: [
        { provide: RouteToolService, useValue: routeToolServiceSpy },
        { provide: Location, useValue: {} },
        { provide: AppStore, useValue: {} },
        { provide: RecordService, useValue: recordServiceSpy },
      ],
    });
  });

  afterEach(() => vi.resetAllMocks());

  const initField = (value: string | null): FormlyFieldConfig => {
    const type = TestBed.runInInjectionContext(() => new PatronsRoute().getTypes()[0]);
    const field = type.formFieldMap!({ props: {} }, jsonSchema);
    const f: FormlyFieldConfig = { props: {}, formControl: new FormControl(value) };
    field.hooks!.afterContentInit!(f);
    return f;
  };

  const queriedPids = () => recordServiceSpy.getRecords.mock.calls[0][1].query;

  it('should only propose the manageable libraries for a new value', () => {
    const f = initField(null);
    expect(queriedPids()).toBe('pid:1');
    expect(f.props!.disabled).toBeFalsy();
  });

  it('should keep a manageable library editable', () => {
    const f = initField('https://bib.rero.ch/api/libraries/1');
    expect(queriedPids()).toBe('pid:1');
    expect(f.props!.disabled).toBeFalsy();
  });

  it('should display a non manageable library as disabled', () => {
    const f = initField('https://bib.rero.ch/api/libraries/2');
    expect(queriedPids()).toBe('pid:1 OR pid:2');
    expect(f.props!.disabled).toBe(true);
  });
});
