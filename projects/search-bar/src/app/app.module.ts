import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader as BaseTranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RecordModule } from '@rero/ng-core';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SharedPipesModule } from 'projects/admin/src/app/shared/shared-pipes.module';
import { TranslateLoader } from 'projects/admin/src/app/translate/loader/translate-loader';
import { SearchBarComponent } from 'projects/public-search/src/app/search-bar/search-bar.component';


@NgModule({
  declarations: [
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    FormsModule,
    RecordModule,
    ReactiveFormsModule,
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
  entryComponents: [
    SearchBarComponent
  ]
})
export class AppModule {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const searchBar = createCustomElement(SearchBarComponent, { injector: this.injector });
    customElements.define('main-search-bar', searchBar);
  }
}
