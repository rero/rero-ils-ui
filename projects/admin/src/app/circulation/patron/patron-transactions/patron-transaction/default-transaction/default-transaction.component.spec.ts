import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultTransactionComponent } from './default-transaction.component';

describe('DefaultTransactionComponent', () => {
  let component: DefaultTransactionComponent;
  let fixture: ComponentFixture<DefaultTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
