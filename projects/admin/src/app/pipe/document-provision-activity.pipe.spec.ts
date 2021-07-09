/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { DocumentProvisionActivityPipe } from './document-provision-activity.pipe';

describe('ProvisionActivityPipe', () => {

  let pipe: DocumentProvisionActivityPipe;

  const provisionActivity = [
    {
      _text: [{ language: 'default', value: 'Brussels : Ed. Artoria, [1999]'}],
      place: [{ country: 'be', type: 'bf:place'}],
      startDate: 1999,
      statement: [
        {
          label: [{ value: 'Brussels'}],
          type: 'bf:Place'
        },
        {
          label: [{ value: 'Ed. Artoria'}],
          type: 'bf:Agent'
        },
        {
          label: [{ value: '[1999]'}],
          type: 'Date'
        }
      ],
      type: 'bf:Publication'
    },
    {
      _text: [{ language: 'default', value: 'Martigny'}],
      statement: [
        {
          label: [{ value: 'Martigny'}],
          type: 'bf:Place'
        }
      ],
      type: 'bf:Distribution'
    }
  ];

  const provisionActivityResult = {
     'bf:Publication': [ 'Brussels : Ed. Artoria, [1999]' ],
     'bf:Distribution': [ 'Martigny' ] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentProvisionActivityPipe
      ]
    });
    pipe = TestBed.inject(DocumentProvisionActivityPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform the data', () => {
    expect(pipe.transform(provisionActivity)).toEqual(provisionActivityResult);
  });
});
