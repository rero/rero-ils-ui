// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { RecordService } from '@rero/ng-core';
import { AppStore, testUserPatronWithSettings, User } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';

import { PatronProfilePersonalEditorComponent } from './patron-profile-personal-editor.component';

describe('PatronProfilePersonalEditorComponent', () => {
  const schema = {
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        city: { type: 'string' },
      },
    },
  };

  const selfSignedUpUser = new User({
    user: { id: 9, username: 'newuser', email: 'newuser@example.com' } as any,
    patrons: [],
    permissions: [],
  });
  const patronUser = new User(cloneDeep(testUserPatronWithSettings));

  async function createComponent(user: User): Promise<PatronProfilePersonalEditorComponent> {
    await TestBed.configureTestingModule({
      imports: [PatronProfilePersonalEditorComponent],
      providers: [
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: MessageService, useValue: { add: vi.fn() } },
        { provide: TranslateService, useValue: { instant: vi.fn((message: string) => message) } },
        {
          provide: RecordService,
          useValue: {
            getSchemaForm: vi.fn().mockReturnValue(of(cloneDeep(schema))),
            getRecord: vi.fn().mockReturnValue(of({ metadata: {} })),
          },
        },
        {
          provide: AppStore,
          useValue: {
            user: vi.fn().mockReturnValue(user),
            settings: vi.fn().mockReturnValue({ userProfile: { readOnlyFields: ['city'] } }),
          },
        },
      ],
    })
      .overrideComponent(PatronProfilePersonalEditorComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const component = TestBed.createComponent(PatronProfilePersonalEditorComponent).componentInstance;
    component.ngOnInit();
    return component;
  }

  function isDisabled(component: PatronProfilePersonalEditorComponent, key: string): boolean {
    return Boolean(component.fields[0].fieldGroup.find((field) => field.key === key).props.disabled);
  }

  it.each([
    ['a user without patron record', selfSignedUpUser, false],
    ['a user with a patron record', patronUser, true],
  ])('should disable read-only fields only for %s', async (_scenario, user, disabled) => {
    const component = await createComponent(user);

    expect(isDisabled(component, 'city')).toBe(disabled);
    expect(isDisabled(component, 'first_name')).toBe(false);
  });
});
