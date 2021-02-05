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

import { HttpHeaders } from '@angular/common/http';

export abstract class AbstractApiService {

  // ATTRIBUTES ============================================================
  /** HTTP headers to use for HTTP `PATCH` method */
  static HEADERS_PATCH_METHOD = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json-patch+json'
    })
  };


  // FUNCTIONS =============================================================
  /**
   * Allow to convert agnostic data update request to JsonPatch data allowed for PATCH method.
   *
   * The input data should be an array of basic change request.
   * The response will be a valid JsonPatch data model (see http://jsonpatch.com/)
   *
   * Ex: convertPatchData([
   *   {path: 'parent.child.child', value:'new_value'},
   *   {path: '/parent.child', op:'add', value: 'new_value'}
   * ])
   * >>> [
   * >>>   {op: 'replace', path: '/parent/child/child', value:'new_value'},
   * >>>   {op: 'add', path: '/parent/child', value:'new_value'}
   * >>> ]
   *
   * @param data: the data to convert.
   */
  protected convertPatchData(data: Array<any> = []): void {
    data.map(entry => {
      // add a 'replace' operation if no other operation are define (add, remove, copy, ...)
      if (!entry.hasOwnProperty('op')) {
        entry.op = 'replace';
      }
      // convert ES path to JsonPatch path. Ex: 'patron.pid' --> '/patron/pid'
      entry.path = entry.path.replace(/\./g, '/');
      if (!entry.path.startsWith('/')) {
        entry.path = entry.path.replace(/^/, '/');
      }
    });
  }
}
