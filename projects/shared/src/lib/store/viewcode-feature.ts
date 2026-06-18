// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { patchState, signalMethod, signalStoreFeature, withMethods, withState } from "@ngrx/signals";

type viewCode = {
  viewCode: string;
}

const viewCodeInitialState: viewCode = {
  viewCode: "global"
};

export function withViewCode() {
  return signalStoreFeature(
    withState<viewCode>(viewCodeInitialState),
    withMethods(store => ({
      change: signalMethod<string>(viewCode => {
        patchState(store, { viewCode })
      })
    }))
  );
}
