/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY, without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
