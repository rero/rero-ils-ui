// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { computed } from "@angular/core";
import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string };

type RequestStatusState = { requestStatus: RequestStatus };

export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({requestStatus: 'idle'}),
    withComputed(({ requestStatus }) => {
      return {
        isPending: computed(() => requestStatus() === 'pending'),
        isFulfilled: computed(() => requestStatus() === 'fulfilled'),
        error: computed(() => {
          const status = requestStatus();
          return (typeof status === 'object') ? status.error : null;
        })
      }
    })
  )
}

export function setPending(): RequestStatusState {
  return { requestStatus: 'pending' };
}

export function setFulfilled(): RequestStatusState {
  return { requestStatus: 'fulfilled' };
}

export function setError(error: string): RequestStatusState {
  return { requestStatus: { error } };
}
