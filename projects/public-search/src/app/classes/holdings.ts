// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
export type HoldingCanRequest = {
  holdingPid: string;
  libraryPid: string;
  patronBarcode: string;
}

export type HoldingPatronRequest = {
  holding_pid: string;
  pickup_location_pid: string;
  description: string;
}
