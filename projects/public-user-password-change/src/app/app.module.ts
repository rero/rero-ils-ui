/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreConfigService, CoreModule, RecordModule, TranslateLoader } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { fieldPasswordMatchValidator, PatronProfilePasswordComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-password/patron-profile-password.component';
import { AppConfigService } from './app-config.service';
import { AppInitializerService } from './app-initializer.service';

/** function to instantiate the application  */
export function appInitFactory(appInitializerService: AppInitializerService) {
  return () => appInitializerService.load().toPromise();
}

@NgModule({
  declarations: [
    PatronProfilePasswordComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FormlyModule.forRoot({
      validators: [
        { name: 'passwordMatch', validation: fieldPasswordMatchValidator }
      ]
    }),
    FormlyBootstrapModule,
    CoreModule,
    RecordModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: BaseTranslateLoader,
        useClass: TranslateLoader,
        deps: [CoreConfigService, HttpClient]
      },
      isolate: false
    }),
    SharedModule,
    LoadingBarHttpClientModule,
    LoadingBarModule,
    TooltipModule.forRoot(),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AppInitializerService], multi: true },
    { provide: CoreConfigService, useClass: AppConfigService }
  ]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    if (!customElements.get('public-user-password-change')) {
      const element = createCustomElement(PatronProfilePasswordComponent, { injector: this.injector });
      customElements.define('public-user-password-change', element);
    }
  }
}
