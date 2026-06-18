// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

export enum ILLRequestStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  DENIED = 'denied',
  CLOSED = 'closed'
}
