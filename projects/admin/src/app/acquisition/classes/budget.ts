// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase
import { ObjectReference } from '@rero/shared';

/** Wrapping class to describe an AcqAccount */
export class AcqBudget {
  $schema: string = null;
  pid: string = null;
  name = '';
  start_date = '';
  end_date = '';
  is_active = false;
  organisation: ObjectReference;

  /**
   * Constructor
   * @param obj - the JSON parsed object to load.
   */
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
