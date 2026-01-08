import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PatronProfileFeesComponent } from './patron-profile-fees.component';
import { PatronProfileMenuStore } from '../store/patron-profile-menu-store';
import { FeesStore } from '../store/fees-store';
import { PanelModule } from 'primeng/panel';

describe('PatronProfileFeesComponent', () => {
  let component: PatronProfileFeesComponent;
  let fixture: ComponentFixture<PatronProfileFeesComponent>;
  let mockFeesStore: any;
  let mockMenuStore: any;

  beforeEach(async () => {
    mockFeesStore = {
      fees: signal([]),
      feesLoading: signal(false),
      loadFees: jasmine.createSpy('loadFees')
    };

    mockMenuStore = {
      currentPatron: signal({ organisation: { currency: 'CHF' } })
    };

    await TestBed.configureTestingModule({
      declarations: [PatronProfileFeesComponent],
      imports: [
        TranslateModule.forRoot(),
        PanelModule
      ],
      providers: [
        { provide: FeesStore, useValue: mockFeesStore },
        { provide: PatronProfileMenuStore, useValue: mockMenuStore },
        provideNoopAnimations()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatronProfileFeesComponent);
    component = fixture.componentInstance;
    component.feesTotal = 12.50;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have currency property', () => {
    expect(component.currency).toBe('CHF');
  });
});
