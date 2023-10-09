/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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

export enum EntityType {
  ORGANISATION = 'bf:Organisation',
  PERSON = 'bf:Person',
  PLACE = 'bf:Place',
  TEMPORAL = 'bf:Temporal',
  TOPIC = 'bf:Topic',
  WORK = 'bf:Work',
}

export enum EntityTypeIcon {
  ORGANISATION = 'fa-building-o',
  PERSON = 'fa-user-o',
  PLACE = 'fa-map-marker',
  TEMPORAL = 'fa-calendar',
  TOPIC = 'fa-tag',
  WORK = 'fa-book',
}

export class Entity {
  /**
   * Get Entity icon
   * @param resourceType type of entity
   * @returns the icon class name
   */
   static getIcon(resourceType: string): string {
    const icons = new Map<string, string>([
      [EntityType.ORGANISATION, EntityTypeIcon.ORGANISATION],
      [EntityType.PERSON, EntityTypeIcon.PERSON],
      [EntityType.TEMPORAL, EntityTypeIcon.TEMPORAL],
      [EntityType.PLACE, EntityTypeIcon.PLACE],
      [EntityType.TOPIC, EntityTypeIcon.TOPIC],
      [EntityType.WORK, EntityTypeIcon.WORK]
    ]);
    if (!icons.has(resourceType)) {
      return 'fa-question-circle';
    }
    return icons.get(resourceType);
  }
}
