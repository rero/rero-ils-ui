/*
 * RERO ILS UI
 * Copyright (C) 2022-2025 RERO
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

import { Component } from '@angular/core';

@Component({
    selector: 'admin-acquisition-main',
    template: `
    <router-outlet></router-outlet>
    <p-toast>
      <ng-template #message let-message>
        <div class="ui:flex ui:flex-col ui:items-start" style="flex: 1">
          <div class="ui:font-medium ui:text-lg ui:text-surface-900">
            {{ message.summary }}
          </div>
          <p [innerHtml]="message.detail"></p>
        </div>
      </ng-template>
    </p-toast>
    <p-confirmDialog />
  `,
    standalone: false
})
export class AcquisitionMainComponent {

}
