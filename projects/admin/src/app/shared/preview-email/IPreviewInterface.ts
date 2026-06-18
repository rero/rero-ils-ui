// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
