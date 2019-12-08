/*
 * Invenio angular core
 * Copyright (C) 2019 RERO
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

import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { map, delay } from 'rxjs/operators';
import { RecordService } from '@rero/ng-core';

@Component({
  selector: 'admin-editor-formly-ref-wrapper',
  template: `
    <div *ngIf="value" class="form-group mb-0">
      <label [attr.for]="id" class="" *ngIf="to.label">
        <span [tooltip]="to.description">{{ to.label }}</span>
        <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
      </label>
      <h4>
        <span class="badge badge-light">
          {{ value }}
        </span>
      </h4>
      <div *ngIf="showError" class="invalid-feedback d-block">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
    </div>
  `
})
export class RefComponent extends FieldWrapper implements OnInit {
  constructor(private recordService: RecordService) {
    super();
  }
  value = null;
  ngOnInit() {
    setTimeout(() => this.getMefData(this.field.formControl.value));
    this.field.formControl.valueChanges.subscribe(v => {
      this.getMefData(v);
    });
  }

  getMefData(v) {
    if (v == null) {
      this.value = null;
      this.field.hide = true;
      return;
    }
    this.recordService
      .getRecord('mef', v.split('/').pop(), 1)
      .pipe(
        map(data => {
          for (const source of ['rero', 'bnf', 'gnd']) {
            if (
              data.metadata[source] &&
              data.metadata[source].preferred_name_for_person
            ) {
              return data.metadata[source].preferred_name_for_person;
            }
          }
        })
      )
      .subscribe(name => (this.value = name));
  }
}
