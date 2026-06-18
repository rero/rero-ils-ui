// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
export class Tools {
  /**
   * Validate an email address
   * @param email - the user email
   * @returns boolean - true if the email address is valid
   */
  static validateEmail(email: string): boolean {
    const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }

  static currencySymbol(language: string, currency: string): string {
    return Intl.NumberFormat(language,{ style:'currency', currency })
      .formatToParts().find(part => part.type === 'currency').value;
  }
}
