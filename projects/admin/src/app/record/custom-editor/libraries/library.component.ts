// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { AsyncValidatorFn, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryCodeTranslatePipe } from '@app/admin/pipe/country-code-translate.pipe';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AbstractCanDeactivateComponent, ApiService, cleanDictKeys, CONFIG, RecordService, removeEmptyValues, UniqueValidator, UpperCaseFirstPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { Fieldset } from 'primeng/fieldset';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { finalize } from 'rxjs';
import { take } from 'rxjs/operators';
import { ExceptionDates, Library } from '../../../classes/library';
import { NotificationType } from '../../../classes/notification';
import { ExceptionDatesEditComponent } from './exception-dates-edit/exception-dates-edit.component';
import { ExceptionDatesListComponent } from './exception-dates-list/exception-dates-list.component';
import { LibraryFormService } from './library-form.service';
import { LibraryStore } from './library.store';
import { NotificationTypePipe } from './pipe/notificationType.pipe';

type SelectOption = { value: string; label: string; disabled?: boolean };

@Component({
    selector: 'admin-libraries-library',
    templateUrl: './library.component.html',
    providers: [LibraryStore, LibraryFormService],
    imports: [TranslateDirective, FormsModule, ReactiveFormsModule, Bind, Accordion, AccordionPanel, Ripple, AccordionHeader, AccordionContent, InputText, InputGroup, InputGroupAddon, Select, NgClass, ToggleSwitch, Button, ExceptionDatesListComponent, InputNumber, Tooltip, Divider, Tabs, TabList, Tab, TabPanels, TabPanel, NgTemplateOutlet, Fieldset, Tag, TitleCasePipe, UpperCaseFirstPipe, TranslatePipe, NotificationTypePipe, Badge],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent extends AbstractCanDeactivateComponent {

  private libraryForm: LibraryFormService = inject(LibraryFormService);
  protected readonly libraryStore = inject(LibraryStore);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private appStore = inject(AppStore);
  private apiService: ApiService = inject(ApiService);
  private translateService: TranslateService = inject(TranslateService);
  private countryCodeTranslatePipe: CountryCodeTranslatePipe = inject(CountryCodeTranslatePipe);
  private messageService: MessageService = inject(MessageService);
  private dialogService: DialogService = inject(DialogService);

  // COMPONENT ATTRIBUTES =====================================================
  /** The current library. */
  readonly library = signal<Library | null>(null);
  /** The angular form to edit the library. */
  private recordService: RecordService = inject(RecordService);

  // COMPONENT ATTRIBUTES =====================================================
  /** The angular form to edit the library — set once schemas + data are ready. */
  readonly libForm = signal<UntypedFormGroup | null>(null);

  /** Translated options for dropdowns — derived from store data */
  readonly rolloverAccountTransferOptions = computed<SelectOption[]>(() =>
    this.libraryStore.rolloverAccountTransferOptions().map(option => ({
      value: option,
      label: this.translateService.instant(option),
    }))
  );

  readonly availableCommunicationLanguagesOptions = computed<SelectOption[]>(() => {
    const langs = this.libraryStore.availableCommunicationLanguages();
    if (!langs.length) return [];
    return [
      { value: '', label: this.translateService.instant('Choose a language'), disabled: true },
      ...langs.map(lang => ({ value: lang, label: this.translateService.instant(`lang_${lang}`), disabled: false })),
    ];
  });

  readonly countryIsoCodesOptions = computed<SelectOption[]>(() =>
    this.libraryStore.countryIsoCodes().map(code => ({
      value: code,
      label: this.countryCodeTranslatePipe.transform(code),
    }))
  );

  /** possible delayed notification types. */
  public delayedNotificationTypes = [NotificationType.AVAILABILITY];

  // Guards against double-click: Angular's HttpClient defers request dispatch via an async scheduler,
  // so the HTTP interceptor counter is not yet incremented when a second click fires in the same JS tick.
  // A local signal set synchronously at the top of onSubmit() closes that window.
  isSaving = false;

  /** Can deactivate guard */
  public canDeactivate = false;

  /** Expose store signals to template */
  readonly exceptionDates = this.libraryStore.exceptionDates;

  // GETTER & SETTER ==========================================================
  get name() { return this.libraryForm.name; }
  get address() { return this.libraryForm.address; }
  get email() { return this.libraryForm.email; }
  get code() { return this.libraryForm.code; }
  get communicationLanguage() { return this.libraryForm.communication_language; }
  get openingHours() { return this.libraryForm.opening_hours as UntypedFormArray; }
  get notificationSettings() { return this.libraryForm.notification_settings as UntypedFormArray; }
  get rolloverSettings() { return this.libraryForm.rollover_settings as UntypedFormGroup; }

  constructor() {
    super();

    // When schemas are loaded, build the form then load the record if editing.
    effect(() => {
      const notifTypes = this.libraryStore.notificationTypes();
      if (!notifTypes.length) return;

      this.libraryForm.notificationTypes = notifTypes;
      this.libraryForm.build();

      const { pid } = this.route.snapshot.params;
      if (pid) {
        this.libraryStore.loadLibrary(pid);
      } else {
        this.libraryStore.setNewLibrary();
        this.libForm.set(this.libraryForm.form);
        this.setAsyncValidator();
      }
    });

    // When the library is loaded from the store, populate the form.
    effect(() => {
      const lib = this.libraryStore.library();
      if (!lib || !this.libraryForm.form) return;
      this.libraryForm.populate(lib);
      this.libForm.set(this.libraryForm.form);
      this.setAsyncValidator();
    });
  }

  addException(): void {
    this.dialogService.open(ExceptionDatesEditComponent, {
      header: this.translateService.instant('Exception'),
      modal: true,
      width: '50vw',
      closable: false,
      data: { exceptionDate: null }
    })?.onClose.pipe(take(1)).subscribe((value?: ExceptionDates) => {
      if (value) {
        this.libraryStore.addExceptionDate(value);
      }
    });
  }

  // COMPONENT FUNCTIONS ======================================================
  setAsyncValidator() {
    this.libForm()!.controls['code'].setAsyncValidators([
      UniqueValidator.createValidator(
        this.recordService,
        'libraries',
        'code',
        this.libraryStore.library()?.pid ?? undefined
      ) as AsyncValidatorFn
    ]);
  }

  onSubmit() {
    if (this.isSaving) { return; }
    this.isSaving = true;
    this.canDeactivate = true;
    const library = this.libraryStore.library()!;
    const formValues = this.libraryForm.getValues();
    this._cleanFormValues(formValues);
    formValues.exception_dates = this.libraryStore.exceptionDates();
    library.update(formValues);

    if (library.pid) {
      this.recordService
        .update('libraries', library.pid, cleanDictKeys(library as any), this.libraryStore.currentLibraryETag())
        .pipe(finalize(() => this.isSaving = false))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('libraries'),
              detail: this.translateService.instant('Record Updated!'),
              life: CONFIG.MESSAGE_LIFE
            });
            this.router.navigate(['records', 'libraries', 'detail', library.pid]);
          },
          error: (error) => {
            this.messageService.add(
              (error.status === 409 || error.status === 412)
                ? {
                    severity: 'warn',
                    summary: this.translateService.instant('Record conflict'),
                    detail: this.translateService.instant('This record has been modified by another user. Please reload the page — your local changes will be lost.'),
                    sticky: true,
                    closable: true
                  }
                : {
                    severity: 'error',
                    summary: this.translateService.instant('libraries'),
                    detail: error.title,
                    sticky: true,
                    closable: true
                  }
            );
          }
      });
    } else {
      library.organisation = { $ref: this.apiService.getRefEndpoint('organisations', this.appStore.currentOrganisationPid()) };
      this.recordService
        .create('libraries', cleanDictKeys(library as any))
        .pipe(finalize(() => this.isSaving = false))
        .subscribe({
          next: (record: any) => {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('libraries'),
              detail: this.translateService.instant('Record created!'),
              life: CONFIG.MESSAGE_LIFE
            });
            this.router.navigate(['records', 'libraries', 'detail', record.metadata.pid]);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('libraries'),
              detail: error.title,
              sticky: true,
              closable: true
            });
          }
      });
    }
  }

  onCancel() {
    this.canDeactivate = true;
    this.router.navigate(['/', 'records', 'libraries', 'detail', this.libraryStore.library()!.pid]);
  }

  addTime(dayIndex: number): void {
    this.libraryForm.addTime(dayIndex);
  }

  deleteTime(dayIndex: number, timeIndex: number): void {
    this.libraryForm.deleteTime(dayIndex, timeIndex);
  }

  private _cleanFormValues(formValues: any): void {
    formValues.opening_hours.forEach((day: { is_open: boolean; times: unknown[] }) => {
      if (!day.is_open) {
        day.times = [];
      }
    });
    formValues.notification_settings = formValues.notification_settings.filter((element: { email: string }) => element.email !== '');
    formValues.acquisition_settings = removeEmptyValues(formValues.acquisition_settings);
    formValues.serial_acquisition_settings = removeEmptyValues(formValues.serial_acquisition_settings);
  }
}
