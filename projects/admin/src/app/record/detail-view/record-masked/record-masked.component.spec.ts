// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
    imports: [
        TranslateModule.forRoot(),
        RecordMaskedComponent,
        KeyExistsPipe
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
  });

  it('should create', () => {
    fixture.componentRef.setInput('record', recordMasked);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return a eye red icon (record with flag _masked true)', () => {
    fixture.componentRef.setInput('record', recordMasked);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('Masked');
    expect(icon.attributes.class.textContent).toContain('fa-eye-slash');
  });

  it('should return a eye green icon (record with flag _masked false)', () => {
    fixture.componentRef.setInput('record', recordNoMaskedWithFlag);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('No masked');
    expect(icon.attributes.class.textContent).toContain('fa-eye');
  });

  it('should return a eye gree icon (record without flag _masked)', () => {
    fixture.componentRef.setInput('record', recordNoMaskedNoFlag);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('No masked');
    expect(icon.attributes.class.textContent).toContain('fa-eye');
  });

  it('should return a bullet red icon (record with flag _masked true)', () => {
    fixture.componentRef.setInput('record', recordMasked);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('Masked');
    expect(icon.attributes.class.textContent).toContain('fa fa-eye-slash text-error');
  });

  it('should return a eye green icon (record without flag _masked)', () => {
    fixture.componentRef.setInput('record', recordNoMaskedNoFlag);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.attributes.title.textContent).toContain('No masked');
    expect(icon.attributes.class.textContent).toContain('fa fa-eye text-success');
  });

  it('should return a bullet red icon with label (record with flag _masked true)', () => {
    fixture.componentRef.setInput('record', recordMasked);
    fixture.componentRef.setInput('withLabel', true);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('span');
    expect(label.textContent).toContain('Masked');
  });

  it('should return a bullet green icon with label (record without flag _masked)', () => {
    fixture.componentRef.setInput('record', recordNoMaskedNoFlag);
    fixture.componentRef.setInput('withLabel', true);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('span');
    expect(label.textContent).toContain('No masked');
  });
});
