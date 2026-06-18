// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

export enum IdentifierTypes {
  AUDIO_ISSUE_NUMBER = 'bf:AudioIssueNumber',
  DOI = 'bf:Doi',
  EAN = 'bf:Ean',
  GTIN_14 = 'bf:Gtin14Number',
  IDENTIFIER = 'bf:Identifier',
  ISAN = 'bf:Isan',
  ISBN = 'bf:Isbn',
  ISMN = 'bf:Ismn',
  ISRC = 'bf:Isrc',
  ISSN = 'bf:Issn',
  L_ISSN = 'bf:IssnL',
  LCCN = 'bf:Lccn',
  LOCAL = 'bf:Local',
  MATRIX_NUMBER = 'bf:MatrixNumber',
  MUSIC_DISTRIBUTOR_NUMBER = 'bf:MusicDistributorNumber',
  MUSIC_PLATE = 'bf:MusicPlate',
  MUSIC_PUBLISHER_NUMBER = 'bf:MusicPublisherNumber',
  PUBLISHER_NUMBER = 'bf:PublisherNumber',
  UPC = 'bf:Upc',
  URN = 'bf:Urn',
  VIDEO_RECORDING_NUMBER = 'bf:VideoRecordingNumber',
  URI = 'uri'
}
