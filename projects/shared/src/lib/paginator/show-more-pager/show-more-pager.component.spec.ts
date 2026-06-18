// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Paginator } from '../paginator';
import { ShowMorePagerComponent } from './show-more-pager.component';
import { ButtonModule } from 'primeng/button';


describe('ShowMorePagerComponent', () => {
  let component: ShowMorePagerComponent;
  let fixture: ComponentFixture<ShowMorePagerComponent>;
  let button: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot(),
        ButtonModule,
        ShowMorePagerComponent
    ]
})
    .compileComponents();
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
