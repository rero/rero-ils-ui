// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentDescriptionComponent } from './document-description.component';

describe('DocumentDescriptionComponent', () => {
  let component: DocumentDescriptionComponent;
  let fixture: ComponentFixture<DocumentDescriptionComponent>;

  /**
   * Create the component for the given document metadata and run its init hook.
   * The template is deliberately not rendered: these tests target the metadata processing only.
   * @param metadata - the document metadata exposed through the `record` input
   */
  function withMetadata(metadata: object): void {
    fixture = TestBed.createComponent(DocumentDescriptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('record', { metadata });
    component.ngOnInit();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({}), DocumentDescriptionComponent]
    }).compileComponents();
  });

  it('should create', () => {
    withMetadata({});
    expect(component).toBeTruthy();
  });

  describe('provision activity notes', () => {
    it('should group notes by provision activity type', () => {
      withMetadata({
        provisionActivity: [
          { type: 'bf:Production', note: 'assumed place' },
          { type: 'bf:Production', note: 'assumed agent' },
          { type: 'bf:Distribution', note: 'distributor unknown' }
        ]
      });
      expect(component.provisionActivityNotes).toEqual({
        'bf:Production': ['assumed place', 'assumed agent'],
        'bf:Distribution': ['distributor unknown']
      });
    });

    it('should keep the note of a bf:Publication, whose statement is rendered in the header', () => {
      withMetadata({
        provisionActivity: [{ type: 'bf:Publication', note: 'uncertain publication date' }]
      });
      expect(component.provisionActivityNotes).toEqual({
        'bf:Publication': ['uncertain publication date']
      });
    });

    it('should ignore provision activities without a note', () => {
      withMetadata({
        provisionActivity: [
          { type: 'bf:Publication', startDate: 1999 },
          { type: 'bf:Production', note: 'assumed place' }
        ]
      });
      expect(component.provisionActivityNotes).toEqual({ 'bf:Production': ['assumed place'] });
    });

    it('should stay undefined when no provision activity holds a note', () => {
      withMetadata({ provisionActivity: [{ type: 'bf:Publication', startDate: 1999 }] });
      expect(component.provisionActivityNotes).toBeUndefined();
    });

    it('should stay undefined without any provision activity', () => {
      withMetadata({});
      expect(component.provisionActivityNotes).toBeUndefined();
    });
  });

  describe('temporal coverage', () => {
    it('should strip the leading plus sign of a single date', () => {
      withMetadata({ temporalCoverage: [{ type: 'time', date: '+1945-05-08' }] });
      expect(component.temporalCoverages).toEqual(['1945-05-08']);
    });

    it('should keep the minus sign of a BCE date', () => {
      withMetadata({ temporalCoverage: [{ type: 'time', date: '-0500' }] });
      expect(component.temporalCoverages).toEqual(['-0500']);
    });

    it('should format a period', () => {
      withMetadata({
        temporalCoverage: [{ type: 'period', start_date: '+1914', end_date: '+1918' }]
      });
      expect(component.temporalCoverages).toEqual(['1914 - 1918']);
    });

    it('should format a period with only a start date', () => {
      withMetadata({ temporalCoverage: [{ type: 'period', start_date: '+1914' }] });
      expect(component.temporalCoverages).toEqual(['1914']);
    });

    it('should append the period codes', () => {
      withMetadata({
        temporalCoverage: [{ type: 'time', date: '+1945', period_code: ['x1x4', 'y2y5'] }]
      });
      expect(component.temporalCoverages).toEqual(['1945 (x1x4, y2y5)']);
    });

    it('should display a period code alone', () => {
      withMetadata({ temporalCoverage: [{ type: 'time', period_code: ['x1x4'] }] });
      expect(component.temporalCoverages).toEqual(['(x1x4)']);
    });

    it('should ignore an entry holding no displayable value', () => {
      withMetadata({ temporalCoverage: [{ type: 'time' }] });
      expect(component.temporalCoverages).toEqual([]);
    });

    it('should stay empty without any temporal coverage', () => {
      withMetadata({});
      expect(component.temporalCoverages).toEqual([]);
    });
  });

  describe('cartographic attributes', () => {
    it('should keep an attribute holding only an equinox', () => {
      withMetadata({ cartographicAttributes: [{ equinox: 'J2000' }] });
      expect(component.cartographicAttributes).toEqual([{ equinox: 'J2000' }]);
    });

    it('should keep an attribute holding a projection', () => {
      withMetadata({ cartographicAttributes: [{ projection: 'Mercator' }] });
      expect(component.cartographicAttributes).toEqual([{ projection: 'Mercator' }]);
    });

    it('should keep an attribute holding labelled coordinates', () => {
      const attribute = { coordinates: { label: 'E 6°--E 10°' } };
      withMetadata({ cartographicAttributes: [attribute] });
      expect(component.cartographicAttributes).toEqual([attribute]);
    });

    it('should discard an attribute holding no displayable value', () => {
      withMetadata({
        cartographicAttributes: [{ coordinates: { longitude: 'E0060000' } }]
      });
      expect(component.cartographicAttributes).toEqual([]);
    });
  });

  describe('work access point', () => {
    it('should include the form subdivisions', () => {
      withMetadata({
        work_access_point: [{ title: 'Die Zauberflöte', form_subdivision: ['Libretti', 'Excerpts'] }]
      });
      expect(component.workAccessPoint).toEqual(['Die Zauberflöte. Libretti. Excerpts.']);
    });

    it('should not add a separator without form subdivisions', () => {
      withMetadata({ work_access_point: [{ title: 'Die Zauberflöte' }] });
      expect(component.workAccessPoint).toEqual(['Die Zauberflöte.']);
    });
  });

  describe('scaleRatios', () => {
    it('should join the horizontal and vertical ratios', () => {
      withMetadata({});
      expect(component.scaleRatios({ ratio_linear_horizontal: '25000', ratio_linear_vertical: '50000' }))
        .toBe('25000 / 50000');
    });

    it('should return the only available ratio', () => {
      withMetadata({});
      expect(component.scaleRatios({ ratio_linear_horizontal: '25000' })).toBe('25000');
    });

    it('should return null without any ratio', () => {
      withMetadata({});
      expect(component.scaleRatios({})).toBeNull();
    });
  });

  describe('classificationQualifiers', () => {
    it('should join the type, the edition and the assigner', () => {
      withMetadata({});
      expect(component.classificationQualifiers({
        type: 'bf:ClassificationDdc',
        edition: '23',
        assigner: 'DLC'
      })).toBe('bf:ClassificationDdc, 23, DLC');
    });

    it('should keep the type alone when no other qualifier is set', () => {
      withMetadata({});
      expect(component.classificationQualifiers({ type: 'bf:ClassificationLcc' }))
        .toBe('bf:ClassificationLcc');
    });

    it('should skip the missing edition', () => {
      withMetadata({});
      expect(component.classificationQualifiers({ type: 'bf:ClassificationUdc', assigner: 'DLC' }))
        .toBe('bf:ClassificationUdc, DLC');
    });
  });
});
