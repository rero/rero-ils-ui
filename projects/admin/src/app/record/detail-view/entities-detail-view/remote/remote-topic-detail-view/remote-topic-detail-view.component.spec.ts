// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RemoteTopicDetailViewComponent } from './remote-topic-detail-view.component';

describe('RemoteTopicDetailViewComponent', () => {
  let component: RemoteTopicDetailViewComponent;
  let fixture: ComponentFixture<RemoteTopicDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RemoteTopicDetailViewComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RemoteTopicDetailViewComponent);
    component = fixture.componentInstance;
  });

  it('should stay empty without any record', () => {
    expect(component.exactMatch()).toEqual([]);
    expect(component.closeMatch()).toEqual([]);
  });

  it('should keep the first uri of a match', () => {
    fixture.componentRef.setInput('record', {
      exactMatch: [{
        authorized_access_point: 'Photographie',
        source: 'idref',
        identifiedBy: [
          { type: 'bf:Local', value: 'ignored' },
          { type: 'uri', value: 'https://www.idref.fr/027224651' },
          { type: 'uri', value: 'https://www.idref.fr/second' }
        ]
      }]
    });
    expect(component.exactMatch()).toEqual([{
      authorized_access_point: 'Photographie',
      source: 'idref',
      uri: 'https://www.idref.fr/027224651'
    }]);
  });

  it('should omit the uri when the match has no identifier of that type', () => {
    fixture.componentRef.setInput('record', {
      closeMatch: [{ authorized_access_point: 'Photographie', source: 'gnd', identifiedBy: [] }]
    });
    expect(component.closeMatch()).toEqual([{
      authorized_access_point: 'Photographie',
      source: 'gnd'
    }]);
  });

  /**
   * The detail view rebinds the `record` input instead of recreating this component
   * when navigating to another remote entity: the matches must be recomputed.
   */
  it('should replace the matches of the previous entity', () => {
    fixture.componentRef.setInput('record', {
      exactMatch: [{ authorized_access_point: 'Photographie', source: 'idref' }]
    });
    expect(component.exactMatch()).toHaveLength(1);

    fixture.componentRef.setInput('record', { closeMatch: [{ authorized_access_point: 'Image', source: 'gnd' }] });
    expect(component.exactMatch()).toEqual([]);
    expect(component.closeMatch()).toHaveLength(1);
  });
});
