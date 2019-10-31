import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { TypeaheadModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader as BaseTranslateLoader } from '@ngx-translate/core';
import { TranslateLoader } from 'projects/admin/src/app/translate/loader/translate-loader';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from 'projects/public-search/src/app/search-bar/search-bar.component';
import { RecordModule } from '@rero/ng-core';

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
    TypeaheadModule.forRoot()
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
