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
export type ITypeEmail = {
  type: string;
  address: string;
}

export type IRecipientSuggestion = {
  address: string;
  type?: string[];
}

export type ISuggestions = {
  emails: string[];
  recipients: ITypeEmail[];
}

export type IPreview = {
  preview: string;
  recipient_suggestions: IRecipientSuggestion[];
  message?: {
    type: string,
    content: string
  }[];
}
