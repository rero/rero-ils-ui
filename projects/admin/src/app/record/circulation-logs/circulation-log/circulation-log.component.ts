/*
 * RERO ILS UI
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
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'admin-circulation-log',
  templateUrl: './circulation-log.component.html',
  styleUrls: ['./circulation-log.component.css']
})
export class CirculationLogComponent {
  /** Operation log record */
  @Input() record: any;

  /** Event for close dialog */
  @Output() closeDialogEvent  = new EventEmitter();

  /** Circulation informations is collapsed */
  isCollapsed = true;

  /** Close dialog */
  closeDialog(): void {
    this.closeDialogEvent.emit(null);
  }
}
