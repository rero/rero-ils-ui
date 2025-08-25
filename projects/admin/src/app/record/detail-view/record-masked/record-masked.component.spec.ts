/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { KeyExistsPipe } from '@rero/shared';
import { RecordMaskedComponent } from './record-masked.component';


describe('MaskedComponent', () => {
  let component: RecordMaskedComponent;
  let fixture: ComponentFixture<RecordMaskedComponent>;

  const recordMasked = {
    metadata: {
      pid: '1',
      _masked: true
    }
  };

  const recordNoMaskedWithFlag = {
    metadata: {
      pid: '1',
      _masked: false
    }
  };

  const recordNoMaskedNoFlag = {
    metadata: {
      pid: '1'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecordMaskedComponent,
        KeyExistsPipe
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordMaskedComponent);
    component = fixture.componentInstance;
    component.record = recordMasked;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a eye red icon (record with flag _masked true)', () => {
    component.record = recordMasked;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('Masked');
    expect(icon.attributes.class.textContent).toContain('fa-eye-slash');
  });

  it('should return a eye green icon (record with flag _masked false)', () => {
    component.record = recordNoMaskedWithFlag;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('No masked');
    expect(icon.attributes.class.textContent).toContain('fa-eye');
  });

  it('should return a eye gree icon (record without flag _masked)', () => {
    component.record = recordNoMaskedNoFlag;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('No masked');
    expect(icon.attributes.class.textContent).toContain('fa-eye');
  });

  it('should return a bullet red icon (record with flag _masked true)', () => {
    component.record = recordMasked;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('Masked');
    expect(icon.attributes.class.textContent).toContain('fa fa-eye-slash text-error');
  });

  it('should return a eye green icon (record without flag _masked)', () => {
    component.record = recordNoMaskedNoFlag;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('No masked');
    expect(icon.attributes.class.textContent).toContain('fa fa-eye text-success');
  });

  it('should return a bullet red icon with label (record with flag _masked true)', () => {
    component.record = recordMasked;
    component.withLabel = true;
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('span');
    expect(label.textContent).toContain('Masked');
  });

  it('should return a bullet green icon with label (record without flag _masked)', () => {
    component.record = recordNoMaskedNoFlag;
    component.withLabel = true;
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('span');
    expect(label.textContent).toContain('No masked');
  });
});
