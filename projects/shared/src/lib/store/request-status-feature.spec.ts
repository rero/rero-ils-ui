// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { setError, setFulfilled, setPending, withRequestStatus } from './request-status-feature';

const TestStore = signalStore(
  withRequestStatus(),
  withMethods((store) => ({
    applyPending: () => patchState(store, setPending()),
    applyFulfilled: () => patchState(store, setFulfilled()),
    applyError: (error: string) => patchState(store, setError(error)),
  }))
);

describe('RequestStatusFeature', () => {
  let store: InstanceType<typeof TestStore>;

  beforeEach(() => {
    store = TestBed.configureTestingModule({
      providers: [TestStore]
    }).inject(TestStore);
  });

  describe('helper functions', () => {
    it('setPending() returns pending status object', () => {
      expect(setPending()).toEqual({ requestStatus: 'pending' });
    });

    it('setFulfilled() returns fulfilled status object', () => {
      expect(setFulfilled()).toEqual({ requestStatus: 'fulfilled' });
    });

    it('setError() returns error status object', () => {
      expect(setError('Something went wrong')).toEqual({ requestStatus: { error: 'Something went wrong' } });
    });
  });

  describe('initial state', () => {
    it('should start with idle status', () => {
      expect(store.requestStatus()).toBe('idle');
    });

    it('isPending should be false', () => {
      expect(store.isPending()).toBe(false);
    });

    it('isFulfilled should be false', () => {
      expect(store.isFulfilled()).toBe(false);
    });

    it('error should be null', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('pending status', () => {
    beforeEach(() => store.applyPending());

    it('requestStatus should be pending', () => {
      expect(store.requestStatus()).toBe('pending');
    });

    it('isPending should be true', () => {
      expect(store.isPending()).toBe(true);
    });

    it('isFulfilled should be false', () => {
      expect(store.isFulfilled()).toBe(false);
    });

    it('error should be null', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('fulfilled status', () => {
    beforeEach(() => store.applyFulfilled());

    it('requestStatus should be fulfilled', () => {
      expect(store.requestStatus()).toBe('fulfilled');
    });

    it('isPending should be false', () => {
      expect(store.isPending()).toBe(false);
    });

    it('isFulfilled should be true', () => {
      expect(store.isFulfilled()).toBe(true);
    });

    it('error should be null', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('error status', () => {
    beforeEach(() => store.applyError('Network error'));

    it('requestStatus should contain the error object', () => {
      expect(store.requestStatus()).toEqual({ error: 'Network error' });
    });

    it('isPending should be false', () => {
      expect(store.isPending()).toBe(false);
    });

    it('isFulfilled should be false', () => {
      expect(store.isFulfilled()).toBe(false);
    });

    it('error should return the error message', () => {
      expect(store.error()).toBe('Network error');
    });
  });
});
