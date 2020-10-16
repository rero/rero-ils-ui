/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RecordModule, TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe, SharedModule } from '@rero/shared';
import { DocumentsTypeahead } from '../class/documents-typeahead';
import { ItemsTypeahead } from '../class/items-typeahead';
import { MefOrganisationTypeahead } from '../class/mef-organisation-typeahead';
import { MefPersonTypeahead } from '../class/mef-person-typeahead';
import { UiRemoteTypeaheadService } from './ui-remote-typeahead.service';

describe('UiRemoteTypeaheadService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RecordModule,
      HttpClientTestingModule,
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }),
      SharedModule
    ],
    providers: [
      DocumentsTypeahead,
      ItemsTypeahead,
      MefPersonTypeahead,
      MefOrganisationTypeahead,
      TruncateTextPipe,
      MainTitlePipe
    ]
  }));

  it('should be created', () => {
    const service: UiRemoteTypeaheadService = TestBed.get(UiRemoteTypeaheadService);
    expect(service).toBeTruthy();
  });
});
