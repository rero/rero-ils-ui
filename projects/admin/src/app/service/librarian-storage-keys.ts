// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Local storage keys of the data kept for the librarian logged in, removed
 * on logout so that the next one on a shared computer does not inherit them,
 * except those of LIBRARIAN_STORAGE_KEYS_KEPT_ON_LOGOUT.
 */
export const LIBRARIAN_STORAGE_KEYS = {
  advancedSearch: 'advancedSearch',
  dueDate: 'due_date_remember',
  library: 'menu_library',
} as const;

export type LibrarianStorageKey = (typeof LIBRARIAN_STORAGE_KEYS)[keyof typeof LIBRARIAN_STORAGE_KEYS];

/**
 * Local storage keys kept on logout. The library switched to is kept: on the
 * next login, the app initializer restores it only if the librarian has
 * access to it, and removes it otherwise.
 */
export const LIBRARIAN_STORAGE_KEYS_KEPT_ON_LOGOUT: readonly LibrarianStorageKey[] = [LIBRARIAN_STORAGE_KEYS.library];
