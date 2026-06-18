// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
