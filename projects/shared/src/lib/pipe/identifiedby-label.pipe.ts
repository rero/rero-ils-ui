// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'identifiedByLabel' })
export class IdentifiedByLabelPipe implements PipeTransform {

  /**
   * Pipe transformation method.
   * Format identifiedBy as a string.
   * @param identifiedBy - the list of identifiedBy to display
   * @param types - list of type used to filter identifier
   * @param separator - the glue string to use to join parts
   * @return the entity label
   */
  transform(identifiedBy: any[], types: string[] = [], separator = ', '): string | null {
    const identifiers: any[] = (types.length && identifiedBy?.length)
      ? identifiedBy.filter(identifier => types.includes(identifier.type))
      : identifiedBy;
    return identifiers
      ? identifiers.map(data => data.value).join(separator)
      : null;
  }
}
