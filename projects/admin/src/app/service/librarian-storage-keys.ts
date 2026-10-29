// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Local storage keys of the data kept for the librarian logged in, removed
 * on logout so that the next one on a shared computer does not inherit them.
 */
export const LIBRARIAN_STORAGE_KEYS = {
  advancedSearch: 'advancedSearch',
  dueDate: 'due_date_remember',
  library: 'menu_library',
} as const;
