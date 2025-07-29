/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { APP_BASE_HREF, CommonModule, PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, inject, NgModule, provideAppInitializer } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { _, TranslateLoader as BaseTranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreConfigService, NgCoreTranslateService, primeNGConfig, RecordModule, TranslateLoader } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { BadgeModule } from 'primeng/badge';
import { providePrimeNG } from 'primeng/config';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { TabsModule } from 'primeng/tabs';
import { TimelineModule } from 'primeng/timeline';
import { PatronProfileDocumentComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-document/patron-profile-document.component';
import { PatronProfileFeeComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-fees/patron-profile-fee/patron-profile-fee.component';
import { PatronProfileFeesComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-fees/patron-profile-fees.component';
import { PatronProfileHistoriesComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-histories/patron-profile-histories.component';
import { PatronProfileHistoryComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-histories/patron-profile-history/patron-profile-history.component';
import { PatronProfileIllRequestComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-ill-requests/patron-profile-ill-request/patron-profile-ill-request.component';
import { PatronProfileIllRequestsComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-ill-requests/patron-profile-ill-requests.component';
import { PatronProfileLoanComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-loans/patron-profile-loan/patron-profile-loan.component';
import { PatronProfileLoansComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-loans/patron-profile-loans.component';
import { PatronProfileMenuComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-menu/patron-profile-menu.component';
import { PatronProfileMessageComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-message/patron-profile-message.component';
import {
  fieldPasswordMatchValidator,
  PatronProfilePasswordComponent,
} from 'projects/public-search/src/app/patron-profile/patron-profile-password/patron-profile-password.component';
import { PatronProfilePersonalEditorComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-personal-editor/patron-profile-personal-editor.component';
import { PatronProfilePersonalComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-personal/patron-profile-personal.component';
import { PatronProfileRequestComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-requests/patron-profile-request/patron-profile-request.component';
import { PatronProfileRequestsComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-requests/patron-profile-requests.component';
import { PatronProfileComponent } from 'projects/public-search/src/app/patron-profile/patron-profile.component';
import { LoanStatusBadgePipe } from 'projects/public-search/src/app/pipe/loan-status-badge.pipe';
import { AppConfigService } from './app-config-service.service';
import { AppInitializerService } from './app-initializer.service';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    title: _('Patron: my account'),
    component: PatronProfileComponent
  },
  {
    path: 'user/edit',
    title: _('Patron: edit my profile'),
    component: PatronProfilePersonalEditorComponent
  },
  {
    path: 'password/edit',
    title: _('Patron: change password'),
    component: PatronProfilePasswordComponent
  },
];

@NgModule({
  declarations: [
    PatronProfileComponent,
    PatronProfilePasswordComponent,
    PatronProfileMessageComponent,
    PatronProfileLoansComponent,
    PatronProfileLoanComponent,
    PatronProfilePersonalComponent,
    PatronProfileRequestsComponent,
    PatronProfileRequestComponent,
    PatronProfileFeesComponent,
    PatronProfileFeeComponent,
    PatronProfileHistoriesComponent,
    PatronProfileIllRequestsComponent,
    PatronProfilePersonalEditorComponent,
    PatronProfileIllRequestComponent,
    PatronProfileDocumentComponent,
    PatronProfileHistoryComponent,
    PatronProfileMenuComponent,
    LoanStatusBadgePipe,
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RecordModule,
    RouterLink,
    RouterLinkActive,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
        provide: BaseTranslateLoader,
        useClass: TranslateLoader,
        deps: [CoreConfigService, HttpClient],
      },
      isolate: false,
    }),
    FormlyModule.forRoot({
      validators: [{ name: 'passwordMatch', validation: fieldPasswordMatchValidator }],
    }),
    SharedModule,
    LoadingBarHttpClientModule,
    TabsModule,
    MessageModule,
    MenuModule,
    BadgeModule,
    TimelineModule
  ],
  providers: [
    provideAppInitializer(() => {
      const appInitializerService = inject(AppInitializerService);
      return appInitializerService.load();
    }),
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation],
    },
    { provide: TranslateService, useClass: NgCoreTranslateService },
    { provide: CoreConfigService, useClass: AppConfigService },
    provideAnimationsAsync(),
    providePrimeNG(primeNGConfig)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
