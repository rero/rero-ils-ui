/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
