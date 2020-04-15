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
import { HttpClientModule } from '@angular/common/http';
import { Injector, LOCALE_ID, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreConfigService, RecordModule, TranslateService } from '@rero/ng-core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SharedPipesModule } from 'projects/admin/src/app/shared/shared-pipes.module';
import { AppConfigService } from './app-config.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocumentBriefComponent } from './document-brief/document-brief.component';
import { MainComponent } from './main/main.component';
import { PersonBriefComponent } from './person-brief/person-brief.component';
import { BioInformationsPipe } from './pipes/bio-informations.pipe';
import { BirthDatePipe } from './pipes/birth-date.pipe';
import { MefTitlePipe } from './pipes/mef-title.pipe';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { TranslateLoader } from './translate/loader/translate-loader';

@NgModule({
  declarations: [
    AppComponent,
    DocumentBriefComponent,
    PersonBriefComponent,
    MefTitlePipe,
    BirthDatePipe,
    BioInformationsPipe,
    SearchBarComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    RecordModule,
    TranslateModule.forRoot({
      loader: {
        provide: BaseTranslateLoader,
        useClass: TranslateLoader,
      },
      isolate: false
    }),
    TypeaheadModule.forRoot(),
    SharedPipesModule
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
    PersonBriefComponent,
    SearchBarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private injector: Injector) {
    const searchBar = createCustomElement(SearchBarComponent, { injector: this.injector });
    customElements.define('main-search-bar', searchBar);
  }

}
