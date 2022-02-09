/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
 * Copyright (C) 2022 UCLouvain
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
import { Component, Input } from '@angular/core';
import { PredictionIssue } from 'projects/admin/src/app/service/holdings.service';

@Component({
  selector: 'admin-expected-issue',
  templateUrl: './expected-issue.component.html',
  styleUrls: ['../serial-holding-detail-view.style.scss']
})
export class ExpectedIssueComponent {

  @Input() issue: PredictionIssue;
  @Input() class: string;

}
