// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

/** Interface to describe payments relative to patron transaction events */
export type PaymentData = {
  total: number,
  subtypes: PaymentDataSubtype[]
}

/** Interface to describe a part of a paymentData */
export type PaymentDataSubtype = {
  name: string;
  total: number;
}

export type SubtypeBucket = {
  key: string;
  subtotal: {
    value: number;
  }
  [key: string]: any;
};
