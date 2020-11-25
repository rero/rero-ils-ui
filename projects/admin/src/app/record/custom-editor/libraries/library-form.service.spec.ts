import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { AppModule } from '../../../app.module';
import { LibraryFormService } from './library-form.service';

describe('LibraryFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AppModule,
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: LibraryFormService = TestBed.inject(LibraryFormService);
    expect(service).toBeTruthy();
  });
});
