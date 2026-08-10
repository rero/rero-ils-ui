// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentDescriptionComponent } from './document-description.component';

describe('DocumentDescriptionComponent', () => {
  let component: DocumentDescriptionComponent;
  let fixture: ComponentFixture<DocumentDescriptionComponent>;

  /**
   * Create the component for the given document metadata.
   * The template is deliberately not rendered: these tests target the metadata processing only.
   * @param metadata - the document metadata exposed through the `record` input
   */
  function withMetadata(metadata: object): void {
    fixture = TestBed.createComponent(DocumentDescriptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('record', { metadata });
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

  it('should stay empty without any record', () => {
    fixture = TestBed.createComponent(DocumentDescriptionComponent);
    component = fixture.componentInstance;
    expect(component.identifiedBy()).toEqual([]);
    expect(component.notesGeneral()).toBeUndefined();
  });

  /**
   * The detail view rebinds the `record` input instead of recreating this component
   * when navigating to a linked document. Every derived field must then be recomputed,
   * without keeping nor accumulating the values of the previous document.
   */
  it('should replace the derived fields of the previous document', () => {
    withMetadata({
      identifiedBy: [{ type: 'bf:Isbn', value: '9782070360024' }],
      note: [{ noteType: 'general', label: 'first document note' }],
      temporalCoverage: [{ type: 'time', date: '+1789' }]
    });
    expect(component.identifiedBy()).toHaveLength(1);

    fixture.componentRef.setInput('record', {
      metadata: {
        identifiedBy: [{ type: 'bf:Issn', value: '1234-5678' }]
      }
    });

    expect(component.identifiedBy()).toEqual([
      { type: 'bf:Issn', value: '1234-5678', details: '' }
    ]);
    expect(component.notesGeneral()).toBeUndefined();
    expect(component.temporalCoverages()).toEqual([]);
  });

  describe('identifiers', () => {
    it('should replace the bf:Local type by the source', () => {
      withMetadata({
        identifiedBy: [{ type: 'bf:Local', source: 'RERO', value: 'R008745521' }]
      });
      expect(component.identifiedBy()).toEqual([
        { type: 'RERO', value: 'R008745521', details: '' }
      ]);
    });

    it('should join the qualifier, the status and the note as details', () => {
      withMetadata({
        identifiedBy: [{
          type: 'bf:Isbn',
          value: '9782070360024',
          qualifier: 'broché',
          status: 'invalid',
          note: 'sur la couverture'
        }]
      });
      expect(component.identifiedBy()[0].details).toEqual('broché, invalid, sur la couverture');
    });

    it('should stay empty without any identifier', () => {
      withMetadata({});
      expect(component.identifiedBy()).toEqual([]);
    });
  });

  describe('series statement', () => {
    it('should display the default language first', () => {
      withMetadata({
        seriesStatement: [{
          _text: [
            { language: 'fre', value: 'Collection Folio' },
            { language: 'default', value: 'Folio' }
          ]
        }]
      });
      expect(component.seriesStatement().map(statement => statement.value))
        .toEqual(['Folio', 'Collection Folio']);
    });

    it('should keep every statement', () => {
      withMetadata({
        seriesStatement: [
          { _text: [{ language: 'default', value: 'Folio' }] },
          { _text: [{ language: 'default', value: 'Classiques' }] }
        ]
      });
      expect(component.seriesStatement()).toHaveLength(2);
    });

    it('should ignore a statement without text', () => {
      withMetadata({ seriesStatement: [{ seriesTitle: [{ value: 'Folio' }] }] });
      expect(component.seriesStatement()).toEqual([]);
    });

    it('should stay empty without any series statement', () => {
      withMetadata({});
      expect(component.seriesStatement()).toEqual([]);
    });
  });

  describe('title variants', () => {
    it('should group the variants by title type', () => {
      withMetadata({
        title: [
          { type: 'bf:Title', mainTitle: [{ value: 'Main title' }] },
          { type: 'bf:VariantTitle', mainTitle: [{ value: 'First variant' }] },
          { type: 'bf:VariantTitle', mainTitle: [{ value: 'Second variant' }] },
          { type: 'bf:KeyTitle', mainTitle: [{ value: 'Key title' }] }
        ]
      });
      expect(component.titleVariants()).toEqual({
        'bf:VariantTitle': ['First variant', 'Second variant'],
        'bf:KeyTitle': ['Key title']
      });
    });

    it('should append the subtitle', () => {
      withMetadata({
        title: [{
          type: 'bf:VariantTitle',
          mainTitle: [{ value: 'Main title' }],
          subtitle: [{ value: 'Subtitle' }]
        }]
      });
      expect(component.titleVariants()['bf:VariantTitle']).toEqual(['Main title: Subtitle']);
    });

    it('should append the parts', () => {
      withMetadata({
        title: [{
          type: 'bf:VariantTitle',
          mainTitle: [{ value: 'Main title' }],
          part: [
            { partNumber: [{ value: '2' }], partName: [{ value: 'Le retour' }] },
            { partName: [{ value: 'Suite' }] }
          ]
        }]
      });
      expect(component.titleVariants()['bf:VariantTitle'])
        .toEqual(['Main title. 2, Le retour. Suite']);
    });

    it('should stay empty when the document only holds its main title', () => {
      withMetadata({ title: [{ type: 'bf:Title', mainTitle: [{ value: 'Main title' }] }] });
      expect(component.titleVariants()).toEqual({});
    });
  });

  describe('notes except general', () => {
    it('should group the notes by type, general excluded', () => {
      withMetadata({
        note: [
          { noteType: 'general', label: 'general note' },
          { noteType: 'citedBy', label: 'first citation' },
          { noteType: 'citedBy', label: 'second citation' },
          { noteType: 'accompanyingMaterial', label: 'with a CD' }
        ]
      });
      expect(component.notesExceptGeneral()).toEqual({
        citedBy: ['first citation', 'second citation'],
        accompanyingMaterial: ['with a CD']
      });
    });

    it('should stay undefined when every note is general', () => {
      withMetadata({ note: [{ noteType: 'general', label: 'general note' }] });
      expect(component.notesExceptGeneral()).toBeUndefined();
    });
  });

  describe('provision activity original date', () => {
    it('should keep the original date of the activities that are not a publication', () => {
      withMetadata({
        provisionActivity: [
          { type: 'bf:Production', original_date: '1789' },
          { type: 'bf:Manufacture', original_date: '1791' }
        ]
      });
      expect(component.provisionActivityOriginalDate().map(provision => provision.original_date))
        .toEqual(['1789', '1791']);
    });

    it('should discard the publication activities', () => {
      withMetadata({
        provisionActivity: [{ type: 'bf:Publication', original_date: '1789' }]
      });
      expect(component.provisionActivityOriginalDate()).toEqual([]);
    });

    it('should discard the activities without original date', () => {
      withMetadata({ provisionActivity: [{ type: 'bf:Production', startDate: 1789 }] });
      expect(component.provisionActivityOriginalDate()).toEqual([]);
    });
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
      expect(component.provisionActivityNotes()).toEqual({
        'bf:Production': ['assumed place', 'assumed agent'],
        'bf:Distribution': ['distributor unknown']
      });
    });

    it('should keep the note of a bf:Publication, whose statement is rendered in the header', () => {
      withMetadata({
        provisionActivity: [{ type: 'bf:Publication', note: 'uncertain publication date' }]
      });
      expect(component.provisionActivityNotes()).toEqual({
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
      expect(component.provisionActivityNotes()).toEqual({ 'bf:Production': ['assumed place'] });
    });

    it('should stay undefined when no provision activity holds a note', () => {
      withMetadata({ provisionActivity: [{ type: 'bf:Publication', startDate: 1999 }] });
      expect(component.provisionActivityNotes()).toBeUndefined();
    });

    it('should stay undefined without any provision activity', () => {
      withMetadata({});
      expect(component.provisionActivityNotes()).toBeUndefined();
    });
  });

  describe('temporal coverage', () => {
    it('should strip the leading plus sign of a single date', () => {
      withMetadata({ temporalCoverage: [{ type: 'time', date: '+1945-05-08' }] });
      expect(component.temporalCoverages()).toEqual(['1945-05-08']);
    });

    it('should keep the minus sign of a BCE date', () => {
      withMetadata({ temporalCoverage: [{ type: 'time', date: '-0500' }] });
      expect(component.temporalCoverages()).toEqual(['-0500']);
    });

    it('should format a period', () => {
      withMetadata({
        temporalCoverage: [{ type: 'period', start_date: '+1914', end_date: '+1918' }]
      });
      expect(component.temporalCoverages()).toEqual(['1914 - 1918']);
    });

    it('should format a period with only a start date', () => {
      withMetadata({ temporalCoverage: [{ type: 'period', start_date: '+1914' }] });
      expect(component.temporalCoverages()).toEqual(['1914']);
    });

    it('should append the period codes', () => {
      withMetadata({
        temporalCoverage: [{ type: 'time', date: '+1945', period_code: ['x1x4', 'y2y5'] }]
      });
      expect(component.temporalCoverages()).toEqual(['1945 (x1x4, y2y5)']);
    });

    it('should display a period code alone', () => {
      withMetadata({ temporalCoverage: [{ type: 'time', period_code: ['x1x4'] }] });
      expect(component.temporalCoverages()).toEqual(['(x1x4)']);
    });

    it('should ignore an entry holding no displayable value', () => {
      withMetadata({ temporalCoverage: [{ type: 'time' }] });
      expect(component.temporalCoverages()).toEqual([]);
    });

    it('should stay empty without any temporal coverage', () => {
      withMetadata({});
      expect(component.temporalCoverages()).toEqual([]);
    });
  });

  describe('cartographic attributes', () => {
    it('should keep an attribute holding only an equinox', () => {
      withMetadata({ cartographicAttributes: [{ equinox: 'J2000' }] });
      expect(component.cartographicAttributes()).toEqual([{ equinox: 'J2000' }]);
    });

    it('should keep an attribute holding a projection', () => {
      withMetadata({ cartographicAttributes: [{ projection: 'Mercator' }] });
      expect(component.cartographicAttributes()).toEqual([{ projection: 'Mercator' }]);
    });

    it('should keep an attribute holding labelled coordinates', () => {
      const attribute = { coordinates: { label: 'E 6°--E 10°' } };
      withMetadata({ cartographicAttributes: [attribute] });
      expect(component.cartographicAttributes()).toEqual([attribute]);
    });

    it('should discard an attribute holding no displayable value', () => {
      withMetadata({
        cartographicAttributes: [{ coordinates: { longitude: 'E0060000' } }]
      });
      expect(component.cartographicAttributes()).toEqual([]);
    });
  });

  describe('work access point', () => {
    it('should include the form subdivisions', () => {
      withMetadata({
        work_access_point: [{ title: 'Die Zauberflöte', form_subdivision: ['Libretti', 'Excerpts'] }]
      });
      expect(component.workAccessPoint()).toEqual(['Die Zauberflöte. Libretti. Excerpts.']);
    });

    it('should not add a separator without form subdivisions', () => {
      withMetadata({ work_access_point: [{ title: 'Die Zauberflöte' }] });
      expect(component.workAccessPoint()).toEqual(['Die Zauberflöte.']);
    });

    it('should complete the name of a person creator by its fuller form', () => {
      withMetadata({
        work_access_point: [{
          title: 'Die Zauberflöte',
          creator: {
            type: 'bf:Person',
            preferred_name: 'Mozart, Wolfgang Amadeus',
            fuller_form_of_name: 'Amadeus'
          }
        }]
      });
      expect(component.workAccessPoint())
        .toEqual(['Mozart, Wolfgang Amadeus (Amadeus). Die Zauberflöte.']);
    });

    it('should discard the fuller form of name of a person creator holding a numeration', () => {
      withMetadata({
        work_access_point: [{
          title: 'Die Zauberflöte',
          creator: {
            type: 'bf:Person',
            preferred_name: 'Mozart',
            numeration: 'II',
            fuller_form_of_name: 'Amadeus'
          }
        }]
      });
      expect(component.workAccessPoint()).toEqual(['Mozart II. Die Zauberflöte.']);
    });

    it('should separate the name, the qualifier and the dates of a person creator by a comma', () => {
      withMetadata({
        work_access_point: [{
          title: 'Die Zauberflöte',
          creator: {
            type: 'bf:Person',
            preferred_name: 'Mozart',
            numeration: 'II',
            qualifier: 'compositeur',
            date_of_birth: '1756',
            date_of_death: '1791'
          }
        }]
      });
      expect(component.workAccessPoint())
        .toEqual(['Mozart II, compositeur, 1756-1791. Die Zauberflöte.']);
    });

    it('should end the qualifier of an unnumbered person creator by a period', () => {
      withMetadata({
        work_access_point: [{
          title: 'Die Zauberflöte',
          creator: {
            type: 'bf:Person',
            preferred_name: 'Mozart',
            qualifier: 'compositeur',
            date_of_birth: '1756'
          }
        }]
      });
      expect(component.workAccessPoint()).toEqual(['Mozart, 1756. compositeur. Die Zauberflöte.']);
    });

    it('should append the conference of an organisation creator to its units', () => {
      withMetadata({
        work_access_point: [{
          title: 'Proceedings',
          creator: {
            type: 'bf:Organisation',
            preferred_name: 'Symposium on Glaucoma',
            subordinate_unit: ['New Orleans Academy of Ophthalmology'],
            numbering: '2nd',
            conference_date: '1967',
            place: 'New Orleans'
          }
        }]
      });
      expect(component.workAccessPoint()).toEqual([
        'Symposium on Glaucoma. New Orleans Academy of Ophthalmology. (2nd : 1967 : New Orleans). Proceedings.'
      ]);
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
