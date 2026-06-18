// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

/** Interface to describe an `Organisation` resource */
export type Organisation = {
  $schema: string;
  pid: string;
  name: string;
  code: string;
  address?: string;
  default_currency: string;
  current_budget_pid?: string;
  online_harvested_source?: string;
  collection_enabled_on_public_view?: boolean;
}
