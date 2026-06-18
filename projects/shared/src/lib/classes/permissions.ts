// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

export type RecordPermission = {
  can: boolean;
  reasons?: {
    links?: any;
    others?: any;
  };
};

export type RecordPermissions = {
  create: RecordPermission;
  delete?: RecordPermission;
  list: RecordPermission;
  read?: RecordPermission;
  update?: RecordPermission;
};
