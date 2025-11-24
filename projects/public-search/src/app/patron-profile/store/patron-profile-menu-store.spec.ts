import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { UserService, IPatron } from '@rero/shared';

describe('PatronProfileMenuStore', () => {
  let store: any;
  let mockUserService: jasmine.SpyObj<UserService>;

  const mockPatrons: IPatron[] = [
    { pid: 'p1', barcode: [], roles: ['patron'], organisation: { name: 'Org1' } } as any,
    { pid: 'p2', barcode: [], roles: ['patron'], organisation: { name: 'Org2' } } as any,
  ];

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUser']);
    // the store reads userService.user directly, so we expose a property
    (mockUserService as any).user = { isAuthenticated: true, patrons: mockPatrons } as any;

    TestBed.configureTestingModule({
      providers: [
        PatronProfileMenuStore,
        { provide: UserService, useValue: mockUserService },
      ],
    });
    store = TestBed.inject(PatronProfileMenuStore);
  });

  it('should initialise with patrons and menu items', () => {
    store.init();
    expect(store.patrons().length).toBe(2);
    expect(store.menu().length).toBe(2);
    expect(store.currentPatron()?.pid).toBe('p1');
    // Check menu items have correct structure
    expect(store.menu()[0].value).toBe('p1');
    expect(store.menu()[0].name).toBe('Org1');
  });

  it('should change current patron when changePatron is called', () => {
    store.init();
    // Change to second patron
    store.changePatron('p2');
    expect(store.currentPatron()?.pid).toBe('p2');
    // Verify menu items exist
    expect(store.menu()[1].value).toBe('p2');
    expect(store.menu()[1].name).toBe('Org2');
  });
});
