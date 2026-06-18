// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
export type canRequest = {
  can: boolean;
  reasons?: Record<string, string>;
}
