// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
export type IAvailability = {
  available: boolean;
  status?: string;
  circulation_message?: ICirculationMessage[];
  number_of_request?: number;
  due_date?: string;
}

export type ICirculationMessage = {
  label: string;
  language: string;
}
