import { CoreModule, RecordModule } from '@rero/ng-core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverdueTransactionComponent } from './overdue-transaction.component';


describe('OverdueTransactionComponent', () => {
  let component: OverdueTransactionComponent;
  let fixture: ComponentFixture<OverdueTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        RecordModule,
        RouterTestingModule,
        HttpClientModule,
      ],
      declarations: [
        OverdueTransactionComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
