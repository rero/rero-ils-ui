/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryCodeTranslatePipe } from '@app/admin/pipe/country-code-translate.pipe';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { AbstractCanDeactivateComponent, ApiService, cleanDictKeys, CONFIG, RecordService, removeEmptyValues, UniqueValidator, UpperCaseFirstPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ExceptionDates, Library } from '../../../classes/library';
import { NotificationType } from '../../../classes/notification';
import { ExceptionDatesEditComponent } from './exception-dates-edit/exception-dates-edit.component';
import { LibraryFormService } from './library-form.service';
import { Bind } from 'primeng/bind';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Select } from 'primeng/select';
import { NgClass, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';
import { ExceptionDatesListComponent } from './exception-dates-list/exception-dates-list.component';
import { InputNumber } from 'primeng/inputnumber';
import { Tooltip } from 'primeng/tooltip';
import { Divider } from 'primeng/divider';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Fieldset } from 'primeng/fieldset';
import { Tag } from 'primeng/tag';
import { NotificationTypePipe } from './pipe/notificationType.pipe';
import { Badge } from 'primeng/badge';

type SelectOption = { value: string; label: string; disabled?: boolean };

@Component({
    selector: 'admin-libraries-library',
    templateUrl: './library.component.html',
    imports: [TranslateDirective, FormsModule, ReactiveFormsModule, Bind, Accordion, AccordionPanel, Ripple, AccordionHeader, AccordionContent, InputText, InputGroup, InputGroupAddon, Select, NgClass, ToggleSwitch, Button, ExceptionDatesListComponent, InputNumber, Tooltip, Divider, Tabs, TabList, Tab, TabPanels, TabPanel, NgTemplateOutlet, Fieldset, Tag, TitleCasePipe, UpperCaseFirstPipe, TranslatePipe, NotificationTypePipe, Badge],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent extends AbstractCanDeactivateComponent implements OnInit, OnDestroy {

  private recordService: RecordService = inject(RecordService);
  private libraryForm: LibraryFormService = inject(LibraryFormService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private appStore = inject(AppStore);
  private apiService: ApiService = inject(ApiService);
  private translateService: TranslateService = inject(TranslateService);
  private countryCodeTranslatePipe: CountryCodeTranslatePipe = inject(CountryCodeTranslatePipe);
  private messageService: MessageService = inject(MessageService);
  private dialogService: DialogService = inject(DialogService);

  private dynamicDialogRef: DynamicDialogRef | null = null;

  // COMPONENT ATTRIBUTES =====================================================
  /** The current library. */
  readonly library = signal<Library | null>(null);
  /** The angular form to edit the library. */
  readonly libForm = signal<UntypedFormGroup | null>(null);
  /** The current organisation pid. */
  readonly organisationPid = signal('');
  /** Exception dates (signal for reactivity with OnPush). */
  readonly exceptionDates = signal<ExceptionDates[]>([]);

  /** possible delayed notification types. */
  public delayedNotificationTypes = [NotificationType.AVAILABILITY];

  /** options to use for dropdown list box of the editor */
  readonly rolloverAccountTransferOptions = signal<SelectOption[]>([]);
  readonly availableCommunicationLanguagesOptions = signal<SelectOption[]>([]);
  readonly countryIsoCodesOptions = signal<SelectOption[]>([]);

  /** Can deactivate guard */
  public canDeactivate = false;

  /** Form build event subscription to release the memory. */
  private eventForm!: Subscription;


  // GETTER & SETTER ==========================================================
  /** Name of the library. */
  get name() { return this.libraryForm.name; }
  /** Address of the library. */
  get address() { return this.libraryForm.address; }
  /** Contact email of the library. */
  get email() { return this.libraryForm.email; }
  /** Code of the library. */
  get code() { return this.libraryForm.code; }
  /** Communication language. */
  get communicationLanguage() { return this.libraryForm.communication_language; }
  /** Country list */
  get countries_iso_codes() { return this.libraryForm.countries_iso_codes; }
  /** Hours when the library is open. */
  get openingHours() { return this.libraryForm.opening_hours as UntypedFormArray; }
  /** Notification settings. */
  get notificationSettings() { return this.libraryForm.notification_settings as UntypedFormArray; }
  /** Rollover settings */
  get rolloverSettings() { return this.libraryForm.rollover_settings as UntypedFormGroup; }


  /** NgOnInit hook. */
  ngOnInit() {
    this.route.params.subscribe( (params) => {
      const loggedUser = this.appStore.user();
      if (loggedUser) {
        this.organisationPid.set(this.appStore.currentOrganisationPid());
      }
      this.eventForm = this.libraryForm.create().subscribe((_buildEvent: any) => {
        if (params && params.pid) {
          this.recordService.getRecord('libraries', params.pid).subscribe(record => {
            const lib = new Library(record.metadata as any);
            this.library.set(lib);
            this.exceptionDates.set(lib.exception_dates ?? []);
            this.libraryForm.populate(record.metadata as any);
            this.libForm.set(this.libraryForm.form);
            this.setAsyncValidator();
          });
        } else {
          const lib = new Library({});
          this.library.set(lib);
          this.exceptionDates.set(lib.exception_dates ?? []);
          this.libForm.set(this.libraryForm.form);
          this.setAsyncValidator();
        }
        this._buildOptions();
      });
    });
  }

  addException(): void {
    this.dynamicDialogRef = this.dialogService.open(ExceptionDatesEditComponent, {
      header: this.translateService.instant('Exception'),
      modal: true,
      width: '50vw',
      closable: false,
      data: {
        exceptionDate: null
      }
    });
    this.dynamicDialogRef?.onClose.subscribe((value?: ExceptionDates) => {
      if (value) {
        this.library()!.exception_dates.push(value);
        this.exceptionDates.update(dates => [...dates, value]);
      }
    });
  }

  /** NgOnDestroy hook. */
  ngOnDestroy() {
    this.eventForm.unsubscribe();
  }

  // COMPONENT FUNCTIONS ======================================================
  /** Create the form async validators. */
  setAsyncValidator() {
    this.libForm()!.controls.code.setAsyncValidators([
      UniqueValidator.createValidator(
        this.recordService,
        'libraries',
        'code',
        this.library()!.pid
      ) as any
    ]);
  }

  /** Form submission. */
  onSubmit() {
    this.canDeactivate = true;
    const library = this.library()!;
    this._cleanFormValues(this.libraryForm.getValues());
    library.update(this.libraryForm.getValues());
    if (library.pid) {
      this.recordService
        .update('libraries', library.pid, cleanDictKeys(library as any))
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
          error: (error) => this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('libraries'),
            detail: error.title,
            sticky: true,
            closable: true
          })
      });
    } else {
      library.organisation = { $ref: this.apiService.getRefEndpoint('organisations', this.organisationPid()) };
      this.recordService
        .create('libraries', cleanDictKeys(library as any))
        .subscribe({
          next: (record) => {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('libraries'),
              detail: this.translateService.instant('Record created!'),
              life: CONFIG.MESSAGE_LIFE
            });
            this.router.navigate(['records', 'libraries', 'detail', record.metadata.pid]);
          },
          error: (error) => this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('libraries'),
            detail: error.title,
            sticky: true,
            closable: true
          })
      });
    }
  }



  /** Cancel the edition. */
  onCancel() {
    this.canDeactivate = true;
    this.router.navigate(['/', 'records', 'libraries', 'detail', this.library()!.pid])
  }

  /**
   * Add new opening hours for a specific day.
   * @param dayIndex: the day index where to add a period time.
   */
  addTime(dayIndex: number): void {
    this.libraryForm.addTime(dayIndex);
  }

  /**
   * Delete an existing opening hours.
   * @param dayIndex: the day index where to delete.
   * @param timeIndex: the time period index to delete.
   */
  deleteTime(dayIndex: number, timeIndex: number): void {
    this.libraryForm.deleteTime(dayIndex, timeIndex);
  }


  /**
   * Clean form values before saving the library
   * @param formValues: the form values to clean
   */
  private _cleanFormValues(formValues: any): void {
    // CLEAN OPENING HOURS : When day is defined as closed, remove all periods/times
    formValues.opening_hours.forEach((day: { is_open: boolean; times: unknown[] }) => {
      if (!day.is_open) {
        day.times = [];
      }
    });
    // NOTIFICATIONS
    formValues.notification_settings = formValues.notification_settings.filter((element: { email: string }) => element.email !== '');
    // ACQUISITION SETTINGS
    formValues.acquisition_settings = removeEmptyValues(formValues.acquisition_settings);
    formValues.serial_acquisition_settings = removeEmptyValues(formValues.serial_acquisition_settings);
  }

  private _buildOptions(): void {
    // Build the options for rollover settings
    this.rolloverAccountTransferOptions.set(
      this.libraryForm.account_transfer_options.map(option => ({
        value: option,
        label: this.translateService.instant(option)
      }))
    );
    // Build available communication languages
    this.availableCommunicationLanguagesOptions.set(
      [{
        value: '',
        label: this.translateService.instant('Choose a language'),
        disabled: true
      }].concat(
        this.libraryForm.available_communication_languages.map(lang => ({
          value: lang,
          label: this.translateService.instant(`lang_${lang}`),
          disabled: false
        }))
      )
    );
    // Country codes options
    this.countryIsoCodesOptions.set(
      this.libraryForm.countries_iso_codes.map(code => ({
        value: code,
        label: this.countryCodeTranslatePipe.transform(code)
      }))
    );
  }
}
