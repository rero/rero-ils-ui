// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { APP_BASE_HREF, DatePipe, PlatformLocation } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { provideTranslateLoader, provideTranslateService, TranslateService } from '@ngx-translate/core';
import {
  ComponentCanDeactivateGuard,
  CoreConfigService,
  RecordHandleErrorService as CoreRecordHandleErrorService,
  CoreTranslateLoader,
  httpPendingInterceptor,
  NgCoreTranslateService,
  PasswordGeneratorComponent,
  primeNGConfig,
  provideCore,
  RemoteAutocompleteService,
  TruncateTextPipe,
} from '@rero/ng-core';
import { ItemHoldingsCallNumberPipe, MainTitlePipe } from '@rero/shared';
import { providePrimeNG } from 'primeng/config';
import { SelectAccountEditorWidgetComponent } from './acquisition/components/editor/widget/select-account-editor-widget/select-account-editor-widget.component';
import { registerFormlyExtension } from './acquisition/formly/extension';
import { OrderLineTypeComponent } from './acquisition/formly/type/field-order-line.type';
import { ReceiptLinesTypeComponent } from './acquisition/formly/type/receipt-lines.type';
import { InputNoLabelWrapperComponent } from './acquisition/formly/wrapper/input-no-label.wrapper';
import { routes } from './app.routes';
import { userCurrentLibraryInterceptor } from './interceptor/user-current-library.interceptor';
import { CountryCodeTranslatePipe } from './pipe/country-code-translate.pipe';
import { EntityAutocompleteComponent } from './record/editor/formly/primeng/entity-autocomplete/entity-autocomplete.component';
import { remoteAutocompleteToken } from './record/editor/formly/primeng/remote-autocomplete/remote-autocomplete-factory.service';
import { RemoteAutocompleteService as UiRemoteAutocompleteService } from './record/editor/formly/primeng/remote-autocomplete/remote-autocomplete.service';
import { DocumentsRemoteService } from './record/editor/formly/primeng/remote-autocomplete/remote/documents-remote.service';
import { ItemsRemoteService } from './record/editor/formly/primeng/remote-autocomplete/remote/items-remote.service';
import { MefRemoteService } from './record/editor/formly/primeng/remote-autocomplete/remote/mef-remote.service';
import { PatronsRemoteService } from './record/editor/formly/primeng/remote-autocomplete/remote/patrons-remote.service';
import { FieldCustomInputTypeComponent } from './record/editor/type/field-custom.type';
import { RepeatTypeComponent } from './record/editor/type/repeat-section.type';
import { IdentifiedbyValueComponent } from './record/editor/wrappers/identifiedby-value.component';
import { UserIdComponent } from './record/editor/wrappers/user-id.component';
import { CipoPatronTypeItemTypeComponent } from './record/formly/type/cipo-patron-type-item-type/cipo-patron-type-item-type.component';
import { AppConfigService } from './service/app-config.service';
import { initializeApp } from './service/app-initializer';
import { RecordHandleErrorService } from './service/record.handle-error.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    provideAppInitializer(() => initializeApp()),
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    { provide: TranslateService, useExisting: NgCoreTranslateService },
    { provide: RemoteAutocompleteService, useExisting: UiRemoteAutocompleteService },
    { provide: remoteAutocompleteToken, useExisting: DocumentsRemoteService, multi: true },
    { provide: remoteAutocompleteToken, useExisting: ItemsRemoteService, multi: true },
    { provide: remoteAutocompleteToken, useExisting: MefRemoteService, multi: true },
    { provide: remoteAutocompleteToken, useExisting: PatronsRemoteService, multi: true },
    { provide: CoreConfigService, useClass: AppConfigService },
    {
      provide: LOCALE_ID,
      useFactory: (translate: TranslateService) => translate.getCurrentLang(),
      deps: [TranslateService],
    },
    MainTitlePipe,
    TruncateTextPipe,
    DatePipe,
    // TODO: needed for production build, remove this after it is fixed in the @ngneat/hotkeys library
    ItemHoldingsCallNumberPipe,
    CountryCodeTranslatePipe,
    { provide: CoreRecordHandleErrorService, useExisting: RecordHandleErrorService },
    provideHttpClient(withInterceptors([httpPendingInterceptor, userCurrentLibraryInterceptor])),
    provideCore(),
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerFormlyExtension,
      deps: [TranslateService],
    },
    ComponentCanDeactivateGuard,
    providePrimeNG(primeNGConfig),
    provideTranslateService({
      loader: provideTranslateLoader(CoreTranslateLoader),
    }),
    importProvidersFrom(
      FormlyModule.forChild({
        types: [
          { name: 'receipt-lines', component: ReceiptLinesTypeComponent },
          { name: 'order-line', component: OrderLineTypeComponent },
          { name: 'cipo-pt-it', component: CipoPatronTypeItemTypeComponent },
          { name: 'account-select', component: SelectAccountEditorWidgetComponent },
          { name: 'entity-autocomplete', component: EntityAutocompleteComponent as any },
          { name: 'custom-field', component: FieldCustomInputTypeComponent },
          { name: 'repeat', component: RepeatTypeComponent },
          { name: 'passwordGenerator', component: PasswordGeneratorComponent },
        ],
        wrappers: [
          { name: 'input-no-label', component: InputNoLabelWrapperComponent },
          { name: 'identifiedby-value', component: IdentifiedbyValueComponent },
          { name: 'user-id', component: UserIdComponent },
        ],
      }),
      LoadingBarHttpClientModule
    ),
  ],
};
