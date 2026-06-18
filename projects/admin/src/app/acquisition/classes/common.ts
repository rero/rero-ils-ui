// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

/** Base class for Acquisition resource */
export type IAcqBaseResource = {
  $schema?: string;
  pid?: string;
  organisation: IObjectReference;
  library?: IObjectReference;
}

export type IAcqResourceWithNotes = {
  notes: IAcqNote[];
}

/** Interface to describe an order note */
export type IAcqNote = {
  type: AcqNoteType;
  content: string;
}

/** Enumeration of possible note type */
export enum AcqNoteType {
  STAFF_NOTE = 'staff_note',
  VENDOR_NOTE = 'vendor_note',
  RECEIPT_NOTE = 'receipt_note',
}

export type IObjectReference = {
  $ref?: string;
  pid?: string;
  type?: string;
}
