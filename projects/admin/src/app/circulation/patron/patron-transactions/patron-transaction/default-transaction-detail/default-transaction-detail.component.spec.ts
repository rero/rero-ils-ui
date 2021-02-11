import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DefaultTransactionDetailComponent } from './default-transaction-detail.component';

describe('DefaultTransactionComponent', () => {
  let component: DefaultTransactionDetailComponent;
  let fixture: ComponentFixture<DefaultTransactionDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultTransactionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
