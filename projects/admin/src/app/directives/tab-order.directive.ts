/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
 * Copyright (C) 2020 UCLouvain
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

// Credit :: https://github.com/valor-software/ngx-bootstrap/issues/823#issuecomment-514976712

import { Directive, inject, Input, OnChanges } from '@angular/core';
import { TabDirective } from 'ngx-bootstrap/tabs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tabOrder]'
})
export class TabOrderDirective implements OnChanges {

  private tab: TabDirective = inject(TabDirective);

  @Input() tabOrder = 0;

  /** hook OnChanges */
  ngOnChanges() {
    (this.tab as any).__tabOrder = +this.tabOrder;
    this.tab.tabset.tabs.sort((a: any, b: any) => a.__tabOrder - b.__tabOrder);
  }
}
