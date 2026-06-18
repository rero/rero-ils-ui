// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ResolveFn } from "@angular/router";
import { capitalize } from "@rero/ng-core";

export const typeResolver: ResolveFn<string> = (route) => {
  return capitalize(route.params["type"]);
};
