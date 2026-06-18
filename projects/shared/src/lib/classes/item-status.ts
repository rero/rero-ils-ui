// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { _ } from "@ngx-translate/core";

export enum ItemStatus {
  ON_SHELF = 'on_shelf',
  AT_DESK = 'at_desk',
  ON_LOAN = 'on_loan',
  IN_TRANSIT = 'in_transit',
  EXCLUDED = 'excluded',
  MISSING = 'missing',
}

export enum IssueItemStatus {
  DELETED = 'deleted',
  EXPECTED = 'expected',
  LATE = 'late',
  RECEIVED = 'received',
}

// Marquage pour extraction i18n (si nécessaire)
_('on_shelf');
_('at_desk');
_('on_loan');
_('in_transit');
_('excluded');
_('missing');
_('deleted');
_('expected');
_('late');
_('received');
