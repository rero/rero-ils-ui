/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CoreConfigService, RecordModule, CoreModule, SharedModule, TranslateService } from '@rero/ng-core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppConfigService } from './app-config.service';
import { DocumentBriefComponent } from './document-brief/document-brief.component';
import { PersonBriefComponent } from './person-brief/person-brief.component';
import { MefTitlePipe } from './pipes/mef-title.pipe';
import { BirthDatePipe } from './pipes/birth-date.pipe';
import { BioInformationsPipe } from './pipes/bio-informations.pipe';
import { TranslateModule, TranslateLoader as BaseTranslateLoader } from '@ngx-translate/core';
import { TranslateLoader } from './translate/loader/translate-loader';
import { BsLocaleService } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    DocumentBriefComponent,
    PersonBriefComponent,
    MefTitlePipe,
    BirthDatePipe,
    BioInformationsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    RecordModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: BaseTranslateLoader,
        useClass: TranslateLoader,
      },
      isolate: false
    })
  ],
  providers: [
    {
      provide: CoreConfigService,
      useClass: AppConfigService
    },
    {
      provide: LOCALE_ID,
      useFactory: (translate: TranslateService) => translate.currentLanguage,
      deps: [TranslateService]
    },
    BsLocaleService
  ],
  entryComponents: [
    DocumentBriefComponent,
    PersonBriefComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
