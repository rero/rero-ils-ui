// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InheritedCallNumberComponent } from './inherited-call-number.component';


describe('InheritedCallNumberComponent', () => {
  let component: InheritedCallNumberComponent;
  let fixture: ComponentFixture<InheritedCallNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InheritedCallNumberComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InheritedCallNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
