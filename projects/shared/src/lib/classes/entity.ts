// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

export enum EntityField$ref {
  CONTRIBUTION = 'contribution',
  GENRE_FORM = 'genreForm',
  SUBJECTS = 'subjects'
}

export enum EntityType {
  ORGANISATION = 'bf:Organisation',
  PERSON = 'bf:Person',
  PLACE = 'bf:Place',
  TEMPORAL = 'bf:Temporal',
  TOPIC = 'bf:Topic',
  WORK = 'bf:Work',
}

export enum EntityTypeIcon {
  MISSING = 'fa-solid fa-circle-question',
  ORGANISATION = 'fa-regular fa-building',
  PERSON = 'fa-regular fa-user',
  PLACE = 'fa-solid fa-location-dot',
  TEMPORAL = 'fa-solid fa-calendar-day',
  TOPIC = 'fa-solid fa-tag',
  WORK = 'fa-solid fa-book',
}

export class Entity {

  /** Available fields with entity ref */
  static FIELDS_WITH_REF = [
    EntityField$ref.CONTRIBUTION,
    EntityField$ref.GENRE_FORM,
    EntityField$ref.SUBJECTS
  ];

  /** Map of types => fields */
  private static TYPES_FIELDS = new Map<string, string[]>([
    [EntityType.ORGANISATION, [EntityField$ref.CONTRIBUTION, EntityField$ref.SUBJECTS]],
    [EntityType.PERSON, [EntityField$ref.CONTRIBUTION, EntityField$ref.SUBJECTS]],
    [EntityType.PLACE, [EntityField$ref.SUBJECTS]],
    [EntityType.TEMPORAL, [EntityField$ref.SUBJECTS]],
    [EntityType.TOPIC, [EntityField$ref.GENRE_FORM, EntityField$ref.SUBJECTS]],
    [EntityType.WORK, [EntityField$ref.SUBJECTS]]
  ]);

  /** Map entity type => icon class */
  private static ICONS = new Map<string, string>([
    [EntityType.ORGANISATION, EntityTypeIcon.ORGANISATION],
    [EntityType.PERSON, EntityTypeIcon.PERSON],
    [EntityType.PLACE, EntityTypeIcon.PLACE],
    [EntityType.TEMPORAL, EntityTypeIcon.TEMPORAL],
    [EntityType.TOPIC, EntityTypeIcon.TOPIC],
    [EntityType.WORK, EntityTypeIcon.WORK]
  ]);

  /**
   * Get Entity icon
   * @param resourceType type of entity
   * @returns the icon class name
   */
  static getIcon(resourceType: string): string {
    if (!Entity.ICONS.has(resourceType)) {
      return EntityTypeIcon.MISSING;
    }
    return Entity.ICONS.get(resourceType);
  }

  /**
   * Get Fields search
   * @param type - type of entity
   * @returns the array of field(s)
   */
  static getFieldsSearch(resourceType: string): string[] {
    if (!Entity.TYPES_FIELDS.has(resourceType)) {
      return Entity.FIELDS_WITH_REF;
    }
    return Entity.TYPES_FIELDS.get(resourceType);
  }

  /**
   * Generate the advanced search query
   * @param resourceType - type of entity
   * @param catalogKey - Catalog key
   * @param catalogPid - Catalog pid
   * @returns the search string
   */
  static generateSearchQuery(resourceType: string, catalogKey: string, catalogPid: string): string {
    const queries = [];
    const fields = Entity.getFieldsSearch(resourceType);
    fields.every(
      (field: string) => queries.push(`${field}.entity.pids.${catalogKey}:${catalogPid}`)
    );
    return queries.join(' OR ');
  }

  /**
   * Generate external link for public view
   * @param routerLink - Array of url path
   * @param queryParams - Object of parameters
   * @return the link string
   */
  static generateHrefLink(routerLink: string[], queryParams: object): string {
    let link = routerLink.join('/');
    const params = [];
    if (link.startsWith('//')) {
      link = link.substring(1);
    }
    const keyQueryParams = Object.keys(queryParams);
    if (keyQueryParams.length > 0) {
      link += '?';
      keyQueryParams.forEach((param: string) => params.push(`${param}=${queryParams[param]}`));
      link += params.join('&');
    }
    return link;
  }
}
