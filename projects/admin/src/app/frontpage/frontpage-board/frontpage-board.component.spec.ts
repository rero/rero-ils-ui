import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FrontpageSubBoardComponent } from '../frontpage-sub-board/frontpage-sub-board.component';
import { FrontpageBoardComponent } from './frontpage-board.component';


describe('FrontpageBoardComponent', () => {
  let component: FrontpageBoardComponent;
  let fixture: ComponentFixture<FrontpageBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({}),
        HttpClientModule
      ],
      declarations: [
        FrontpageBoardComponent,
        FrontpageSubBoardComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontpageBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
