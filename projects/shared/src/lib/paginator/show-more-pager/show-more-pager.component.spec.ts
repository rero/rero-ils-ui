// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ButtonModule } from '@openng/optimus-ui/button';

import { Paginator } from '../paginator';
import { ShowMorePagerComponent } from './show-more-pager.component';

describe('ShowMorePagerComponent', () => {
  let component: ShowMorePagerComponent;
  let fixture: ComponentFixture<ShowMorePagerComponent>;
  let button: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule, ShowMorePagerComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMorePagerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'my-button');
    fixture.componentRef.setInput('paginator', new Paginator());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the pager', () => {
    fixture.componentRef.setInput('paginator', new Paginator().setRecordsPerPage(5).setRecordsCount(10));
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('.p-button');
    expect(button.textContent).toContain('Show more');
  });

  it('should not display the pager', () => {
    fixture.componentRef.setInput('paginator', new Paginator().setRecordsPerPage(10).setRecordsCount(8));
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('.p-button');
    expect(button).toBeNull();
  });
});
