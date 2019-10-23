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
import { TestBed } from '@angular/core/testing';
import { RecordStatus } from './record-status';
import { TranslateService, TranslateModule, TranslateLoader as BaseTranslateLoader } from '@ngx-translate/core';
import { TranslateLoader } from '../translate/loader/translate-loader';
import { RouterTestingModule } from '@angular/router/testing';

const record = {
  permissions: {
    cannot_delete: {
      links: {
        items: 2
      }
    }
  }
};

describe('RecordStatus', () => {

  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: BaseTranslateLoader,
            useClass: TranslateLoader,
          },
          isolate: false
        })
      ],
      providers: [TranslateService]
    }).compileComponents();
    translate = TestBed.get(TranslateService);
    translate.use('en');
  });

  it('should return a message', () => {
    RecordStatus.translateService = translate;
    RecordStatus.canDelete(record).subscribe(data => {
      expect(data.message.indexOf('for the following reason') > -1).toBeTruthy();
      expect(data.message.indexOf('has 2 items attached') > -1).toBeTruthy();
    });
  });
});
