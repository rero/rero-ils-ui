// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { formatDate, registerLocaleData } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DateTranslatePipe, Nl2brPipe } from '@rero/ng-core';
import { SafeUrlPipe } from '@rero/shared';
import { of } from 'rxjs';
import { CollectionBriefComponent } from './collection-brief.component';
import localeEnGb from '@angular/common/locales/en-GB';

registerLocaleData(localeEnGb);

@Pipe({ name: 'dateTranslate'})
class MockDateTranslatePipe implements PipeTransform {
  transform(value: string, format = 'mediumDate', timezone?: string): string | null {
    if (value === null || value === undefined) return null;
    try {
      return formatDate(value, format, 'en-GB', timezone);
    } catch {
      return null;
    }
  }
}

@Pipe({ name: 'nl2br'})
class MockNl2brPipe implements PipeTransform {
  transform(value: string): string { return value ?? ''; }
}

@Pipe({ name: 'safeUrl'})
class MockSafeUrlPipe implements PipeTransform {
  transform(value: string): string { return value ?? ''; }
}

describe('CollectionBriefComponent', () => {
  let component: CollectionBriefComponent;
  let fixture: ComponentFixture<CollectionBriefComponent>;

  const record = {
    metadata: {
      title: 'Collection title',
      collection_id: 'C01',
      description: 'description of the collection',
      teachers: [
        { name: 'Teacher name 1' },
        { name: 'Teacher name 2' },
      ],
      start_date: '2025-01-01 08:00:00',
      end_date: '2025-03-31 18:00:00'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CollectionBriefComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ viewcode: 'test' }) }
        }
      ]
    })
    .overrideComponent(CollectionBriefComponent, {
      remove: { imports: [DateTranslatePipe, Nl2brPipe, SafeUrlPipe] },
      add: { imports: [MockDateTranslatePipe, MockNl2brPipe, MockSafeUrlPipe] }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionBriefComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('record', record);
    fixture.componentRef.setInput('type', 'coll');
    fixture.componentRef.setInput('detailUrl', { link: '/test/collections/:pid', external: false });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the information to be displayed', () => {
    const title = fixture.nativeElement.querySelector('h4');
    expect(title.textContent).toContain('Collection title (C01)');
    const div = fixture.nativeElement.querySelectorAll('div > div');
    expect(div[1].textContent).toContain('Teacher name 2');
    expect(div[2].textContent).toContain('description of the collection');
    expect(div[3].textContent).toContain('1 Jan 2025 - 31 Mar 2025');
  });
});
