// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { IRecipientSuggestion, ISuggestions } from "../IPreviewInterface";

export class Tools {
  /**
   *
   * @param suggestions - recipientSuggestion
   * @returns a processed recipients suggestions
   */
  static processRecipientSuggestions(suggestions: IRecipientSuggestion[]): ISuggestions {
    const result = { emails: [], recipients: [] }
    suggestions.map((suggestion: IRecipientSuggestion) => {
      // Adding the email address in the suggestion area
      result.emails.push(suggestion.address);
      // If we have a type, we pre-populate the recipients
      if (suggestion.type) {
        suggestion.type.map((type: string) => {
          result.recipients.push({ address: suggestion.address, type });
        });
      }
    });
    // Sort email addresses by name asc
    result.emails.sort();

    return result;
  }
}
