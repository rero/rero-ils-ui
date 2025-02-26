/*
 * RERO ILS UI
 * Copyright (C) 2021 UCLouvain
 * Copyright (C) 2021 RERO
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
import { Pipe, PipeTransform } from '@angular/core';
import { IPreview } from '@app/admin/shared/preview-email/IPreviewInterface';

@Pipe({
    name: 'previewContent',
    standalone: false
})
export class PreviewContentPipe implements PipeTransform {

  /**
   * Get the order preview content message.
   * @param preview: the API response containing the preview to display.
   * @return the content to of the preview message.
   */
  transform(preview: IPreview): string {
    return preview.preview.substring(preview.preview.indexOf('\n') + 1).trim();
  }

}
