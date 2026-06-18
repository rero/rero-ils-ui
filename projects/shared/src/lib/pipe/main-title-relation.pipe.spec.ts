// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { MainTitleRelationPipe } from './main-title-relation.pipe';

describe('MainTitleRelationPipe', () => {
  let pipe: MainTitleRelationPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MainTitleRelationPipe
      ]
    });

    pipe = TestBed.inject(MainTitleRelationPipe);
  });

  const title = [
      {
          mainTitle: [{value: 'J. Am. Med. Assoc.'}],
          type: 'bf:AbbreviatedTitle'
      },
      {
          mainTitle: [{value: 'J Am Med Assoc'}],
          type: 'bf:KeyTitle'
      },
      {
          _text: 'Journal of the American medical association',
          mainTitle: [{
              value: 'Journal of the American medical association'
          }],
          type: 'bf:Title'
      }
  ];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return only the main title', () => {
    expect(pipe.transform(title)).toContain('Journal of the American medical association');
  });
});
