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
