import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CirculationModule } from '../../circulation.module';
import { PatronTransactionsComponent } from './patron-transactions.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PatronTransactionsComponent', () => {
  let component: PatronTransactionsComponent;
  let fixture: ComponentFixture<PatronTransactionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(),
        RouterTestingModule,
        CirculationModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
