/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, DateTranslatePipe, Nl2brPipe } from '@rero/ng-core';
import { CollectionBriefComponent } from './collection-brief.component';


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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
          CollectionBriefComponent,
          DateTranslatePipe,
          Nl2brPipe
      ],
      imports: [
        TranslateModule.forRoot(),
        CoreModule
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionBriefComponent);
    component = fixture.componentInstance;
    component.record = record;
    component.type = 'coll';
    component.detailUrl = { link: '/foo', external: false };
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
