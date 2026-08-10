// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EntityLinkComponent } from './entity-link.component';

describe('EntityLinkComponent', () => {
  let component: EntityLinkComponent;
  let fixture: ComponentFixture<EntityLinkComponent>;
  let translateService: TranslateService;

  const rousseau = {
    authorized_access_point: 'Rousseau, Jean-Jacques',
    authorized_access_point_en: 'Rousseau, Jean-Jacques (en)',
    authorized_access_point_fr: 'Rousseau, Jean-Jacques (fr)',
    pids: { remote: '1' },
    resource_type: 'remote'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), EntityLinkComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    translateService = TestBed.inject(TranslateService);
    translateService.use('fr');
    fixture = TestBed.createComponent(EntityLinkComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('resourceName', 'contribution');
    fixture.componentRef.setInput('entity', rousseau);
  });

  it('should label the link in the current language', () => {
    expect(component.linkName()).toEqual('Rousseau, Jean-Jacques (fr)');
  });

  it('should fall back on the language agnostic access point', () => {
    fixture.componentRef.setInput('entity', { authorized_access_point: 'Local entity' });
    expect(component.linkName()).toEqual('Local entity');
  });

  it('should follow a language change', () => {
    translateService.use('en');
    expect(component.linkName()).toEqual('Rousseau, Jean-Jacques (en)');
  });

  /**
   * This component is rendered inside `@for` blocks tracked by index: navigating to
   * another record rebinds the `entity` input instead of recreating the component,
   * so every derived value has to be recomputed.
   */
  it('should refresh the link when the entity input is rebound', () => {
    expect(component.linkName()).toEqual('Rousseau, Jean-Jacques (fr)');
    fixture.componentRef.setInput('entity', {
      authorized_access_point_fr: 'Voltaire (fr)',
      pids: { remote: '2' },
      resource_type: 'remote'
    });
    expect(component.linkName()).toEqual('Voltaire (fr)');
    expect(component.queryParams()).toEqual({
      q: 'contribution.entity.pids.remote:2',
      simple: '0'
    });
  });

  it('should search on the entity pid when it has a resource type', () => {
    expect(component.queryParams()).toEqual({
      q: 'contribution.entity.pids.remote:1',
      simple: '0'
    });
  });

  it('should search on the access point when the entity has no resource type', () => {
    fixture.componentRef.setInput('entity', { authorized_access_point: 'Local entity' });
    expect(component.queryParams()).toEqual({
      q: 'contribution.entity.authorized_access_point_fr:"Local entity"',
      simple: '0'
    });
  });

  it('should build the external link from the router params and the query params', () => {
    fixture.componentRef.setInput('external', true);
    fixture.componentRef.setInput('routerLinkParams', ['/', 'global', 'search', 'documents']);
    expect(component.externalHrefLink())
      .toEqual('/global/search/documents?q=contribution.entity.pids.remote:1&simple=0');
  });
});
