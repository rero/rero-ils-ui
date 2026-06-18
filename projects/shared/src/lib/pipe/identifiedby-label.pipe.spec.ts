// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { IdentifiedByLabelPipe } from "./identifiedby-label.pipe";

describe('IdentifiedByLabelPipe', () => {
  let pipe: IdentifiedByLabelPipe;

  const identifiedBy = [
    { type: 'isbn', value: 'ISBN' },
    { type: 'isbn', value: 'ISBN2' },
    { type: 'issn', value: 'ISSN' },
    { type: 'ean', value: 'EAN' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdentifiedByLabelPipe]
    });
    pipe = TestBed.inject(IdentifiedByLabelPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all identifiers', () => {
    expect(pipe.transform(identifiedBy)).toEqual('ISBN, ISBN2, ISSN, EAN');
  });

  it('should return isbn and ean identifiers', () => {
    expect(pipe.transform(identifiedBy, ['isbn', 'ean'])).toEqual('ISBN, ISBN2, EAN')
  });

  it('should return all isbn separated by semicolons', () => {
    expect(pipe.transform(identifiedBy, ['isbn'], '; ')).toEqual('ISBN; ISBN2')
  });
});
