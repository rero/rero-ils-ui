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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, DateTranslatePipe } from '@rero/ng-core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PatronProfilePersonalComponent } from './patron-profile-personal.component';


describe('PatronProfilePersonalComponent', () => {
  let component: PatronProfilePersonalComponent;
  let fixture: ComponentFixture<PatronProfilePersonalComponent>;

  const record = {
    pid: '1',
    gender: 'male',
    username: 'foo-bar',
    street: 'Av. de la Gare',
    postal_code: '1920',
    city: 'Martigny',
    country: 'Suisse',
    phone: '+41 xxxxxxxxx',
    email: 'foo@bar.com',
    patron: {
      barcode: ['A34567878', 'A123468'],
      expiration_date: '2021-12-31 12:00:00',
      keep_history: true
    },
    second_address: {
      street: 'Av. de Tourbillon',
      postal_code: '1950',
      city: 'Sion',
      country: 'Suisse'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatronProfilePersonalComponent,
        DateTranslatePipe
      ],
      imports: [
        CoreModule,
        TranslateModule.forRoot()
      ],
      providers: [
        BsLocaleService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfilePersonalComponent);
    component = fixture.componentInstance;
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    const section = fixture.nativeElement.querySelector('#personal-section');
    expect(section.textContent).toContain('Personal details');

    const dd = fixture.nativeElement.querySelectorAll('#personal-data dl > dd');
    expect(dd[0].textContent).toContain('male');
    expect(dd[1].textContent).toContain('foo-bar');
    expect(dd[2].textContent).toContain('Av. de la Gare 1920 Martigny Suisse');
    expect(dd[3].textContent).toContain('Av. de Tourbillon 1950 Sion Suisse');
    expect(dd[4].textContent).toContain('foo@bar.com');
    expect(dd[5].textContent).toContain('A34567878 ; A123468');
    expect(dd[6].textContent).toContain('12/31/21');
    expect(dd[7].textContent).toContain(
      'The loan history is saved for a maximum of six months. It is visible to you and the library staff.'
    );

    record.patron.keep_history = false;
    fixture.detectChanges();
    expect(dd[7].textContent).toContain('The loan history is not saved.');

    const button = fixture.nativeElement.querySelector('#profile-edit');
    expect(button).toBeDefined();
  });
});
