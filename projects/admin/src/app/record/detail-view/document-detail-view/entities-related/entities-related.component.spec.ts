// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EntitiesRelatedComponent } from './entities-related.component';

describe('EntitiesRelatedComponent', () => {
  let component: EntitiesRelatedComponent;
  let fixture: ComponentFixture<EntitiesRelatedComponent>;

  /**
   * Create the component for the given document metadata.
   * The template is deliberately not rendered: these tests target the metadata processing only.
   * @param metadata - the document metadata exposed through the `record` input
   */
  function withMetadata(metadata: object): void {
    fixture.componentRef.setInput('record', { metadata });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EntitiesRelatedComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    TestBed.inject(TranslateService).use('fr');
    fixture = TestBed.createComponent(EntitiesRelatedComponent);
    component = fixture.componentInstance;
  });

  it('should stay empty without any record', () => {
    expect(component.entities()).toEqual({});
  });

  it('should group the entities by field', () => {
    withMetadata({
      contribution: [
        { entity: { pid: '1', resource_type: 'remote', type: 'bf:Person', authorized_access_point_fr: 'Rousseau' } }
      ],
      genreForm: [
        { entity: { pid: '2', resource_type: 'local', type: 'bf:Topic', authorized_access_point_fr: 'Photographies' } }
      ]
    });
    expect(component.entities()).toEqual({
      contribution: [{
        authorized_access_point: 'Rousseau',
        pid: '1',
        resource_type: 'remote',
        type: 'bf:Person',
        icon: 'fa-regular fa-user'
      }],
      genreForm: [{
        authorized_access_point: 'Photographies',
        pid: '2',
        resource_type: 'local',
        type: 'bf:Topic',
        icon: 'fa-solid fa-tag'
      }]
    });
  });

  it('should discard the entities without resource type', () => {
    withMetadata({
      contribution: [
        { entity: { authorized_access_point_fr: 'Local contributor' } },
        { entity: { pid: '1', resource_type: 'remote', type: 'bf:Person', authorized_access_point_fr: 'Rousseau' } }
      ]
    });
    expect(component.entities().contribution).toHaveLength(1);
  });

  it('should ignore the fields holding no entity', () => {
    withMetadata({ contribution: [], subjects: [{ entity: { pid: '1', resource_type: 'remote', type: 'bf:Work' } }] });
    expect(Object.keys(component.entities())).toEqual(['subjects']);
  });

  /**
   * The detail view rebinds the `record` input instead of recreating this component
   * when navigating to a linked document: the list must be rebuilt from scratch,
   * without accumulating the entities of the previous document.
   */
  it('should replace the entities of the previous document', () => {
    withMetadata({
      contribution: [
        { entity: { pid: '1', resource_type: 'remote', type: 'bf:Person', authorized_access_point_fr: 'Rousseau' } }
      ]
    });
    expect(component.entities().contribution).toHaveLength(1);

    withMetadata({
      subjects: [
        { entity: { pid: '2', resource_type: 'remote', type: 'bf:Place', authorized_access_point_fr: 'Genève' } }
      ]
    });
    expect(component.entities().contribution).toBeUndefined();
    expect(component.entities().subjects).toHaveLength(1);
  });
});
