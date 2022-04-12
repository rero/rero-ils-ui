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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Nl2brPipe } from '@rero/ng-core';
import { JournalVolumePipe } from '../../../pipe/journal-volume.pipe';
import { LoanStatusBadgePipe } from '../../../pipe/loan-status-badge.pipe';
import { NotesFilterPipe } from '@rero/shared';
import { StatusBadgePipe } from '../../../pipe/status-badge.pipe';
import { PatronProfileIllRequestComponent } from './patron-profile-ill-request.component';


describe('PatronProfileIllRequestComponent', () => {
  let component: PatronProfileIllRequestComponent;
  let fixture: ComponentFixture<PatronProfileIllRequestComponent>;

  const record = {
    metadata: {
      pid: '1',
      pickup_location: {
        name: 'Pickup location'
      },
      copy: true,
      pages: '10-21',
      found_in: {
        url: 'http://myurl.com',
        source: 'web'
      },
      notes: [
        {
          type: 'public_note',
          content: 'note content'
        }
      ],
      status: 'validated',
      loan_status: 'ITEM_ON_LOAN',
      document: {
        title: 'ill document title',
        authors: 'author1, author2',
        publisher: 'Document publisher',
        year: '2021',
        identifier: 'Document:identifier',
        published_in: {
          volume: '10',
          number: '20'
        },
        journal_title: 'Journal title'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfileIllRequestComponent,
        NotesFilterPipe,
        Nl2brPipe,
        StatusBadgePipe,
        LoanStatusBadgePipe,
        JournalVolumePipe
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileIllRequestComponent);
    component = fixture.componentInstance;
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document information button and link', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.attributes.id.textContent).toContain('ill-request-1');
    const divs = fixture.nativeElement.querySelectorAll('div > div');
    expect(divs[0].textContent).toContain('ill document title');
    expect(divs[1].textContent).toContain('author1, author2');
    const badges = divs[2].querySelectorAll('span');
    expect(badges[0].attributes.class.textContent).toContain('badge-info');
    expect(badges[0].textContent).toContain('ITEM_ON_LOAN');

    const dd = fixture.nativeElement.querySelectorAll('#ill-detail-1 > dl > dd');
    expect(dd[0].textContent).toContain('Document publisher');
    expect(dd[1].textContent).toContain('2021');
    expect(dd[2].textContent).toContain('Document:identifier');
    expect(dd[3].textContent).toContain('Vol. {{ volume }} &mdash; n°. {{ number }}');
    expect(dd[4].textContent).toContain('Pickup location');
    expect(dd[5].textContent).toContain('Copy');
    expect(dd[6].textContent).toContain('10-21');
    const foundInLink = dd[7].querySelector('a');
    expect(foundInLink.attributes.href.textContent).toContain('http://myurl.com');
    expect(foundInLink.textContent).toContain('http://myurl.com');
    expect(dd[8].textContent).toContain('note content');
  });
});
