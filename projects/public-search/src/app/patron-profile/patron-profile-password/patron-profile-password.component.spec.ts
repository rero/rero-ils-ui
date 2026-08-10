// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HttpPendingService } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { afterEach } from 'vitest';
import { UserApiService } from '../../api/user-api.service';
import {
  fieldPasswordMatchValidator,
  PatronProfilePasswordComponent
} from './patron-profile-password.component';

describe('PatronProfilePasswordComponent', () => {
  let component: PatronProfilePasswordComponent;
  let fixture: ComponentFixture<PatronProfilePasswordComponent>;

  const locationSpy = { back: vi.fn() };
  const messageServiceSpy = { add: vi.fn() };
  const translateServiceSpy = { instant: vi.fn() };
  const httpPendingServiceSpy = { isPending: vi.fn() };
  const userApiServiceSpy = {
    updatePassword: vi.fn(),
    validatePassword: vi.fn()
  };

  beforeEach(async () => {
    translateServiceSpy.instant.mockImplementation((message: string) => message);
    httpPendingServiceSpy.isPending.mockReturnValue(false);
    userApiServiceSpy.validatePassword.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [PatronProfilePasswordComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: HttpPendingService, useValue: httpPendingServiceSpy },
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    })
      .overrideComponent(PatronProfilePasswordComponent, {
        set: {
          imports: [ReactiveFormsModule],
          template: `
            <form [formGroup]="form">
              <input id="password" formControlName="password">
              <input id="newPassword" formControlName="newPassword">
              <input id="confirmPassword" formControlName="confirmPassword">
              <button id="save" [disabled]="!form.valid || httpPending.isPending()">Save</button>
            </form>
          `
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PatronProfilePasswordComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      password: new UntypedFormControl('', Validators.required),
      newPassword: new UntypedFormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new UntypedFormControl('', [Validators.required, Validators.minLength(8)])
    }, fieldPasswordMatchValidator);
    fixture.detectChanges();
  });

  afterEach(() => vi.resetAllMocks());

  function setPasswords(password: string, newPassword: string, confirmPassword: string): void {
    component.model = { password, newPassword, confirmPassword };
    component.form.setValue({ password, newPassword, confirmPassword });
    fixture.detectChanges();
  }

  function returnPasswordError(message: string): void {
    userApiServiceSpy.updatePassword.mockReturnValue(throwError(() => ({
      message: 'Validation error.',
      error: { errors: [{ field: 'password', message }] }
    })));
  }

  function editPasswordField(field: string, value: string): void {
    const input = fixture.nativeElement.querySelector(`#${field}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('should attach a same-password error to the new password field', () => {
    setPasswords('Current123', 'Current123', 'Current123');
    returnPasswordError('Password is the same.');
    const focusSpy = vi.spyOn(
      fixture.nativeElement.querySelector('#newPassword') as HTMLInputElement,
      'focus'
    );

    component.submit();

    expect(component.form.get('password').errors).toBeNull();
    expect(component.form.get('newPassword').errors?.invalid).toEqual({
      message: 'Password is the same.'
    });
    expect(focusSpy).toHaveBeenCalled();
  });

  it.each([
    ['newPassword', 'confirmPassword'],
    ['confirmPassword', 'newPassword']
  ])('should clear the same-password error when %s changes', (field, matchingField) => {
    setPasswords('Current123', 'Current123', 'Current123');
    returnPasswordError('Password is the same.');
    component.submit();

    editPasswordField(field, 'Different123');
    editPasswordField(matchingField, 'Different123');
    fixture.detectChanges();

    expect(component.form.get('newPassword').errors?.invalid).toBeUndefined();
    expect(component.form.get('password').value).toBe('Current123');
    expect(component.form.valid).toBe(true);
    expect((fixture.nativeElement.querySelector('#save') as HTMLButtonElement).disabled).toBe(false);
  });

  it('should preserve other errors when clearing the same-password error', () => {
    setPasswords('Current123', 'Current123', 'Current123');
    returnPasswordError('Password is the same.');
    component.submit();
    const newPasswordControl = component.form.get('newPassword');
    newPasswordControl.setErrors({
      ...newPasswordControl.errors,
      required: true,
      minlength: { requiredLength: 8, actualLength: 0 },
      validatePassword: true
    });

    component.form.get('confirmPassword').setValue('Different123');

    expect(newPasswordControl.errors?.invalid).toBeUndefined();
    expect(newPasswordControl.errors?.required).toBe(true);
    expect(newPasswordControl.errors?.minlength).toEqual({ requiredLength: 8, actualLength: 0 });
    expect(newPasswordControl.errors?.validatePassword).toBe(true);
    expect(component.form.errors?.fieldMatch).toBeDefined();
  });

  it('should keep an incorrect-current-password error on the current password field', () => {
    setPasswords('Current123', 'Different123', 'Different123');
    returnPasswordError('Invalid password.');

    component.submit();
    component.form.get('confirmPassword').setValue('Another123');

    expect(component.form.get('password').errors?.invalid).toEqual({
      message: 'Invalid password.'
    });
    expect(component.form.get('newPassword').errors).toBeNull();
  });

  it.each([
    ['missing error details', { message: 'Validation error.', error: {} }],
    ['an unmapped field', {
      message: 'Validation error.',
      error: { errors: [{ field: 'unknown', message: 'Unexpected error.' }] }
    }]
  ])('should show a generic form error for %s', (_scenario, errorResponse) => {
    setPasswords('Current123', 'Different123', 'Different123');
    userApiServiceSpy.updatePassword.mockReturnValue(throwError(() => errorResponse));

    component.submit();

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'The form contains errors.',
      closable: true
    });
  });
});
