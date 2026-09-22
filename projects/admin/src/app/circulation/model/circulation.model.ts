// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { EsRecord } from "@rero/shared";

/** Minimal shape of a document referenced by a loan item, as exposed by operation_logs. */
export type TransactionDocument = {
  pid: string;
  title: string;
};

/**
 * Minimal shape of an item referenced by a loan, as exposed by operation_logs.
 * Only the pid and the linked document are available here — fields such as
 * barcode or call_number are not part of the log and must be fetched from the
 * actual item record (see `getRecord: 'items'` in the template).
 */
export type TransactionItem = {
  pid: string;
  enumerationAndChronology?: string;
  document: TransactionDocument;
};

/** Minimal shape of a location, as exposed by operation_logs (loan.transaction_location, item.location, ...). */
export type TransactionLocation = {
  pid?: string;
  name: string;
  library?: {
    pid: string;
    name: string;
  };
};

/** Minimal shape of a patron reference, as exposed by operation_logs. */
export type TransactionPatron = {
  pid: string;
  name: string;
};

/** Minimal shape of the `loan` part of an operation_logs record. */
export type TransactionLoan = {
  pid: string;
  trigger: string;
  state: string;
  item: TransactionItem;
  patron: TransactionPatron;
  transaction_location?: TransactionLocation;
  end_date?: string;
  note?: string;
};

/** Minimal shape of an item referenced by a scan_item operation_logs entry (no loan/patron involved). */
export type TransactionScanItem = {
  pid: string;
  call_number?: string;
  category?: string;
  document: TransactionDocument;
  holding?: {
    pid?: string;
    location_pid?: string;
    location_name?: string;
  };
  library_pid?: string;
};

/** Minimal shape of the `scan` part of a scan_item operation_logs entry. */
export type TransactionScan = {
  item: TransactionScanItem;
  note?: string;
  transaction_location?: TransactionLocation;
};

/** Metadata of a circulation operation_logs record whose `record.type` is `loan`. */
export type TransactionLoanMetadata = {
  date: string;
  record: {
    type: 'loan';
    value: string;
  };
  loan: TransactionLoan;
};

/**
 * Metadata of a circulation operation_logs record whose `record.type` is
 * `scan_item`. Unlike a loan entry, there is no patron/loan involved — only
 * a library (the one that performed the scan) and the scanned item.
 */
export type TransactionScanItemMetadata = {
  date: string;
  record: {
    type: 'scan_item';
    value: string;
  };
  library: {
    type: string;
    value: string;
  };
  scan: TransactionScan;
  user_name: string;
};

/** Metadata of a circulation operation_logs record (record.type === 'loan' or 'scan_item'). */
export type TransactionLogMetadata = TransactionLoanMetadata | TransactionScanItemMetadata;

export type TransactionRecord = EsRecord<TransactionLogMetadata>;

/**
 * Type guards for `TransactionLogMetadata`. TypeScript does not narrow a
 * union on a nested discriminant (`metadata.record.type`) the way it does
 * on a top-level one (`metadata.type`) — these guards do it explicitly, so
 * callers can safely access `.loan` or `.scan` afterwards.
 */
export function isLoanMetadata(metadata: TransactionLogMetadata): metadata is TransactionLoanMetadata {
  return metadata.record.type === 'loan';
}

export function isScanItemMetadata(metadata: TransactionLogMetadata): metadata is TransactionScanItemMetadata {
  return metadata.record.type === 'scan_item';
}

/**
 * Metadata of an `items` record, as returned by `RecordService.getRecord('items', pid)`.
 * This is the actual, up-to-date item — unlike `TransactionItem`, which only reflects
 * the state captured in the operation_logs entry at the time of the transaction.
 */
export type ItemRecordMetadata = {
  pid: string;
  barcode?: string;
  call_number?: string;
  status?: string;
  loan?: {
    end_date?: string;
    extension_count?: number;
  }
};

export type ItemRecord = EsRecord<ItemRecordMetadata>;

/**
 * Metadata of a `patrons` record, as returned by `RecordService.getRecord('patrons', pid)`.
 * `transaction().metadata.loan.patron` only carries the pid and the name
 * captured in the operation_logs entry — the barcode is not part of the log
 * and must be fetched from the actual patron record. Note that the barcode
 * is nested under the `patron` role sub-object, and is an array (a patron
 * account can have more than one barcode).
 */
export type PatronRecordMetadata = {
  pid: string;
  patron?: {
    barcode?: string[];
  };
};

export type PatronRecord = EsRecord<PatronRecordMetadata>;

/**
 * Metadata of a `libraries` record, as returned by `RecordService.getRecord('libraries', pid)`.
 * For a scan_item entry, `transaction().metadata.library` only carries a pid
 * (`value`) — the name is not part of the log and must be fetched here.
 */
export type LibraryRecordMetadata = {
  pid: string;
  name: string;
};

export type LibraryRecord = EsRecord<LibraryRecordMetadata>;

/**
 * Metadata of a `documents` record, as returned by
 * `RecordService.getRecord('documents', pid, { headers: { Accept: 'application/rero+json' } })`.
 * The `rero+json` headers resolve the `contribution` entities into embedded
 * objects. `transaction().metadata.loan.item.document` only carries pid and
 * title — authors (contribution) are not part of the operation_logs entry.
 */
export type DocumentRecordMetadata = {
  pid: string;
  contribution?: { entity: unknown; role: string[] }[];
};

export type DocumentRecord = EsRecord<DocumentRecordMetadata>;
