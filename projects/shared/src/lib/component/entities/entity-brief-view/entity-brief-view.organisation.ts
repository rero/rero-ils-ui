/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2024 UCLouvain
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
import { Component, inject, Input, OnInit } from '@angular/core';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';

@Component({
  selector: 'shared-remote-organisation-entity-brief-view',
  template: `
    @if (dates) {
      <p>{{ dates | join : ' - ' }}</p>
    }
  `,
  providers: [ExtractSourceFieldPipe],
})
export class EntityBriefViewRemoteOrganisationComponent implements OnInit {

  protected pipe: ExtractSourceFieldPipe = inject(ExtractSourceFieldPipe);

  @Input() record: any;

  dates: Array<string> = [];

  ngOnInit(): void {
    this.dates = [
      this.pipe.transform(this.record.metadata, 'date_of_establishment'),
      this.pipe.transform(this.record.metadata, 'date_of_termination')
    ].filter(elem => elem);
  }
}
