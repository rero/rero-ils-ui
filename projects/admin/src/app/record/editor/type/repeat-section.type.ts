/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'admin-repeat-section',
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index;" class="row">
      <div class="col-11">
        <formly-field [field]="field"></formly-field>
      </div>
      <div class="col-1 my-0 pt-2 pl-0 d-flex">
        <ng-container
          *ngIf="field.parent.fieldGroup.length > to.minItems"
        ><i (click)="remove(i)" class="pl-3 fa fa-lg fa-trash text-danger" aria-hidden="true"></i></ng-container>
        <ng-container
          *ngIf="field.parent.templateOptions.maxItems > field.parent.fieldGroup.length && field.parent.fieldGroup.length -1 === i"
        ><i (click)="add()" class="pl-3 fa fa-lg fa-plus-circle text-primary" aria-hidden="true"></i></ng-container>
      </div>
    </div>
  `,
})
export class RepeatTypeComponent extends FieldArrayType { }
