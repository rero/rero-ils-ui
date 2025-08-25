/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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

// required as json properties is not lowerCamelCase

/** Base class for Acquisition resource */
export interface IAcqBaseResource {
  $schema?: string;
  pid?: string;
  organisation: IObjectReference;
  library?: IObjectReference;
}

export interface IAcqResourceWithNotes {
  notes: IAcqNote[];
}

/** Interface to describe an order note */
export interface IAcqNote {
  type: AcqNoteType;
  content: string;
}

/** Enumeration of possible note type */
export enum AcqNoteType {
  STAFF_NOTE = 'staff_note',
  VENDOR_NOTE = 'vendor_note',
  RECEIPT_NOTE = 'receipt_note',
}

export interface IObjectReference {
  $ref?: string;
  pid?: string;
  type?: string;
}
