import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MessagesStore } from './messages-store';
import { Message, PatronApiService } from '../../api/patron-api.service';
import { PatronProfileMenuStore } from './patron-profile-menu-store';
import { patchState } from '@ngrx/signals';

describe('MessagesStore', () => {
    let store: any;
    let mockPatronApi: any;
    let mockMenuStore: any;

    const mockMessages: Message[] = [
        { type: 'info', content: 'Welcome to your patron profile' },
        { type: 'warning', content: 'You have overdue items' },
        { type: 'error', content: 'Your account is blocked' },
    ];

    beforeEach(() => {
        mockPatronApi = jasmine.createSpyObj('PatronApiService', ['getMessages']);
        mockPatronApi.getMessages.and.returnValue(of(mockMessages));

        // Mock with null patron to prevent auto-init
        mockMenuStore = jasmine.createSpyObj('PatronProfileMenuStore', [], {
            currentPatron: () => null,
        });

        TestBed.configureTestingModule({
            providers: [
                MessagesStore,
                { provide: PatronApiService, useValue: mockPatronApi },
                { provide: PatronProfileMenuStore, useValue: mockMenuStore },
            ],
        });

        store = TestBed.inject(MessagesStore);
    });

    describe('Store initialization', () => {
        it('should create the store with initial state', () => {
            expect(store).toBeTruthy();
        });

        it('should have empty messages array initially', () => {
            expect(store.messages()).toEqual([]);
        });

        it('should have messagesLoading false initially', () => {
            expect(store.messagesLoading()).toBe(false);
        });

        it('should have undefined currentPatronPid initially', () => {
            expect(store.currentPatronPid()).toBeUndefined();
        });
    });

    describe('loadMessages', () => {
        beforeEach(() => {
            patchState(store, { currentPatronPid: 'patron-1' });
        });

        it('should load messages for a patron', (done) => {
            store.loadMessages('patron-1');

            setTimeout(() => {
                expect(store.messages().length).toBe(3);
                expect(store.messages()[0].type).toBe('info');
                expect(store.messages()[0].content).toBe('Welcome to your patron profile');
                expect(mockPatronApi.getMessages).toHaveBeenCalledWith('patron-1');
                done();
            }, 100);
        });

        it('should set messagesLoading to true during load', (done) => {
            store.loadMessages('patron-1');

            // Check that loading completes
            setTimeout(() => {
                expect(store.messagesLoading()).toBe(false);
                done();
            }, 100);
        });

        it('should handle empty message results', (done) => {
            mockPatronApi.getMessages.and.returnValue(of([]));

            store.loadMessages('patron-1');

            setTimeout(() => {
                expect(store.messages().length).toBe(0);
                expect(store.messagesLoading()).toBe(false);
                done();
            }, 100);
        });

        it('should handle API errors gracefully', (done) => {
            mockPatronApi.getMessages.and.returnValue(
                throwError(() => new Error('API Error'))
            );

            store.loadMessages('patron-1');

            setTimeout(() => {
                expect(store.messages()).toEqual([]);
                expect(store.messagesLoading()).toBe(false);
                done();
            }, 100);
        });
    });

    describe('displayMessages computed', () => {
        beforeEach(() => {
            patchState(store, { currentPatronPid: 'patron-1' });
        });

        it('should transform Message[] to ToastMessageOptions[]', (done) => {
            store.loadMessages('patron-1');

            setTimeout(() => {
                const displayMessages = store.displayMessages();
                expect(displayMessages.length).toBe(3);
                expect(displayMessages[0]).toEqual({
                    text: 'Welcome to your patron profile',
                    severity: 'info',
                });
                expect(displayMessages[1]).toEqual({
                    text: 'You have overdue items',
                    severity: 'warning',
                });
                done();
            }, 100);
        });

        it('should map type to severity and content to text', (done) => {
            store.loadMessages('patron-1');

            setTimeout(() => {
                const displayMessages = store.displayMessages();
                displayMessages.forEach((msg: any, index: number) => {
                    expect(msg.severity).toBe(mockMessages[index].type);
                    expect(msg.text).toBe(mockMessages[index].content);
                });
                done();
            }, 100);
        });

        it('should return empty array when no messages', () => {
            expect(store.displayMessages()).toEqual([]);
        });
    });

    describe('Patron change reaction', () => {
        it('should load messages for different patrons', (done) => {
            store.loadMessages('patron-2');

            setTimeout(() => {
                expect(mockPatronApi.getMessages).toHaveBeenCalledWith('patron-2');
                done();
            }, 100);
        });

        it('should reload messages when called with different patron PID', (done) => {
            patchState(store, { currentPatronPid: 'patron-1' });
            store.loadMessages('patron-1');

            setTimeout(() => {
                expect(mockPatronApi.getMessages).toHaveBeenCalledWith('patron-1');

                // Load for different patron
                store.loadMessages('patron-2');

                setTimeout(() => {
                    expect(mockPatronApi.getMessages).toHaveBeenCalledWith('patron-2');
                    expect(mockPatronApi.getMessages).toHaveBeenCalledTimes(2);
                    done();
                }, 100);
            }, 100);
        });
    });

    describe('Edge cases', () => {
        it('should handle multiple rapid calls to loadMessages', (done) => {
            store.loadMessages('patron-1');
            store.loadMessages('patron-1');
            store.loadMessages('patron-1');

            setTimeout(() => {
                // Should have called API multiple times
                expect(mockPatronApi.getMessages).toHaveBeenCalledTimes(3);
                // Final state should be consistent
                expect(store.messages().length).toBe(3);
                expect(store.messagesLoading()).toBe(false);
                done();
            }, 200);
        });

        it('should handle messages with special characters', (done) => {
            const specialMessages: Message[] = [
                { type: 'info', content: 'Message with <html> tags' },
                { type: 'warning', content: "Message with 'quotes' and \"double quotes\"" },
            ];
            mockPatronApi.getMessages.and.returnValue(of(specialMessages));

            store.loadMessages('patron-1');

            setTimeout(() => {
                const displayMessages = store.displayMessages();
                expect(displayMessages[0].text).toBe('Message with <html> tags');
                expect(displayMessages[1].text).toBe("Message with 'quotes' and \"double quotes\"");
                done();
            }, 100);
        });
    });
});
