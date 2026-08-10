// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

/** A provision activity of a document, as described by the `provisionActivity` field. */
export type ProvisionActivity = {
  type: string;
  note?: string;
  original_date?: string;
};

/** A value of a document field, in a given language ('default' for the main one). */
export type LocalizedText = {
  language: string;
  value: string;
};

/** A series statement of a document, as described by the `seriesStatement` field. */
export type SeriesStatement = {
  _text?: LocalizedText[];
};

/** A cartographic attribute of a document, as described by MARC 255. */
export type CartographicAttribute = {
  projection?: string;
  equinox?: string;
  coordinates?: { label?: string };
};

/** A classification of a document, as described by the `classification` field. */
export type Classification = {
  classificationPortion: string;
  type: string;
  subdivision?: string[];
  edition?: string;
  assigner?: string;
};

/** A scale of a document, as described by the `scale` field. */
export type Scale = {
  label: string;
  type?: string;
  ratio_linear_horizontal?: string;
  ratio_linear_vertical?: string;
};

/** An identifier of a document, as described by the `identifiedBy` field. */
export type RawIdentifier = {
  type: string;
  value: string;
  source?: string;
  qualifier?: string;
  status?: string;
  note?: string;
};

/** A title of a document, as described by the `title` field. */
export type RawTitle = {
  type: string;
  mainTitle: { value: string }[];
  subtitle?: { value: string }[];
  part?: {
    partNumber?: { value: string }[];
    partName?: { value: string }[];
  }[];
};

/** A temporal content coverage of a document, as described by MARC 045. */
export type TemporalCoverage = {
  type: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  period_code?: string[];
};

/** A note of a document, as described by the `note` field. */
export type Note = {
  noteType: string;
  label: string;
};

/** The creator of a work access point, as described by MARC 100, 110 and 111. */
export type WorkAccessAgent = {
  type: string;
  preferred_name?: string;
  numeration?: string;
  fuller_form_of_name?: string;
  qualifier?: string;
  date_of_birth?: string;
  date_of_death?: string;
  subordinate_unit?: string[];
  numbering?: string;
  conference_date?: string;
  place?: string;
};

/** A work access point of a document, as described by the `work_access_point` field. */
export type WorkAccessPoint = {
  title: string;
  creator?: WorkAccessAgent;
  part?: { partNumber?: string, partName?: string }[];
  form_subdivision?: string[];
  miscellaneous_information?: string;
  language?: string;
  medium_of_performance_for_music?: string[];
  key_for_music?: string;
  arranged_statement_for_music?: string;
  date_of_work?: string;
};

/** An identifier of a document, formatted for display. */
export type Identifier = {
  type: string;
  value: string;
  details: string;
};

/**
 * The metadata of a document, restricted to the fields displayed by the description.
 * Fields only forwarded to another component, or whose shape is too deep to be worth
 * describing here, are left loosely typed.
 */
export type DocumentMetadata = {
  acquisitionTerms?: string[];
  adminMetadata?: {
    source?: string;
    descriptionModifier?: string[];
    descriptionLanguage?: string;
    descriptionConventions?: string[];
  };
  bookFormat?: string[];
  cartographicAttributes?: CartographicAttribute[];
  classification?: Classification[];
  colorContent?: string[];
  contentMediaCarrier?: { carrierType: string, contentType?: string[] }[];
  copyrightDate?: string[];
  credits?: string[];
  dimensions?: string[];
  dissertation?: { label?: { value: string }[] }[];
  fiction_statement?: string;
  hasReproduction?: any[];
  identifiedBy?: RawIdentifier[];
  illustrativeContent?: string[];
  intendedAudience?: { value: string }[];
  issuance?: { main_type: string, subtype: string };
  language?: { value: string, note?: string }[];
  note?: Note[];
  originalLanguage?: string[];
  originalTitle?: string[];
  otherEdition?: any[];
  otherPhysicalFormat?: any[];
  productionMethod?: string[];
  provisionActivity?: ProvisionActivity[];
  relatedTo?: any[];
  scale?: Scale[];
  sequence_numbering?: string;
  seriesStatement?: SeriesStatement[];
  supplement?: any[];
  supplementaryContent?: string[];
  tableOfContents?: string[];
  temporalCoverage?: TemporalCoverage[];
  title?: RawTitle[];
  ui_responsibilities?: string[];
  usageAndAccessPolicy?: { label: string }[];
  work_access_point?: WorkAccessPoint[];
};
