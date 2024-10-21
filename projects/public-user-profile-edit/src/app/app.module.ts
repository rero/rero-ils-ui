/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, inject, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader as BaseTranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreConfigService, CoreModule, NgCoreTranslateService, RecordModule, TranslateLoader } from '@rero/ng-core';
import { SharedModule } from '@rero/shared';
import { PatronProfilePersonalEditorComponent } from 'projects/public-search/src/app/patron-profile/patron-profile-personal-editor/patron-profile-personal-editor.component';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { AppInitializerService } from './app-initializer.service';

/** function to instantiate the application  */
export function appInitFactory(appInitializerService: AppInitializerService): () => Observable<any> {
  return () => appInitializerService.load();
}

@NgModule({
  declarations: [
    PatronProfilePersonalEditorComponent
  ],
  imports: [
    RouterModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    RecordModule,
    FormsModule,
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
  ],
  providers: [
    { provide: TranslateService, useClass: NgCoreTranslateService },
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AppInitializerService], multi: true },
    { provide: CoreConfigService, useClass: AppConfigService }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule implements DoBootstrap {

  private injector: Injector = inject(Injector);

  ngDoBootstrap(): void {
    if (!customElements.get('public-user-profile-edit')) {
      const element = createCustomElement(PatronProfilePersonalEditorComponent, { injector: this.injector });
      customElements.define('public-user-profile-edit', element);
    }
  }
}
