import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComponent } from './item.component';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, RecordModule } from '@rero/ng-core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoanComponent } from '../patron/loan/loan.component';
import { ItemsListComponent } from '../items-list/items-list.component';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        CoreModule,
        RecordModule,
        RouterTestingModule,
        HttpClientModule,
        CollapseModule,
        BrowserAnimationsModule
      ],
      declarations: [
        LoanComponent,
        ItemsListComponent,
        ItemComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
