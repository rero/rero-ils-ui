// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

/**
 * Interface to describe an internal resource reference
 * Either the `pid` and `type` is available, either the `$ref`.
 * TODO :: It should be possible to compute $ref from pid/type and reversely */
export type ObjectReference = {
  pid?: string;
  type?: string;
  $ref?: string;
}

/** Interface to describe a multilingual value entry */
export type LocalizedValue = {
  language: string;
  value: string;
}

/** Interface to describe the patron cleanup configuration of an `Organisation` */
export type PatronCleanup = {
  expiration_years?: number;
  inactivity_years?: number;
  excluded_patron_types?: string[];
}

/** Interface to describe the public homepage configuration of an `Organisation` */
export type Homepage = {
  slogan?: LocalizedValue[];
  placeholder?: LocalizedValue[];
  blocks?: {
    left?: LocalizedValue[];
    center?: LocalizedValue[];
    right?: LocalizedValue[];
  };
}

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
  patron_cleanup?: PatronCleanup;
  homepage?: Homepage;
}
