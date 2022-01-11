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
import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'admin-formly-repeat-section',
  template: `
    <div class="card my-2">
      <div class="card-header">
        <label
          *ngIf="field.templateOptions.label || field.templateOptions.addButton" class="col" [ngClass]="field.templateOptions.className">
          <span *ngIf="field.templateOptions.label" >{{ field.templateOptions.label }}</span>
          <button *ngIf="field.templateOptions.addButton"
                  type="button"
                  class="btn btn-link text-secondary btn-sm ng-star-inserted"
                  (click)="add()">
            <i class="fa fa-clone"></i>
          </button>
        </label>
      </div>
      <div class="card-body" *ngIf="field.fieldGroup.length > 0">
        <div class="row">
          <div [ngClass]="field.templateOptions.trashButton ? 'col-11': 'col-12'">
            <div class="row">
              <ng-container *ngFor="let field of field.fieldGroup[0].fieldGroup">
                <ng-container *ngIf="field.className">
                  <div class="{{ field.templateOptions.headerClassName }}">
                    {{ field.templateOptions.label }}
                    <ng-container *ngIf="field.templateOptions.required">&nbsp;*</ng-container>
                  </div>
                </ng-container>
              </ng-container>
            </div>
          </div>
        </div>
        <div *ngFor="let f of field.fieldGroup; let i = index;" class="row" [ngClass]="{ 'bg-light': i % 2 }">
          <ng-container *ngIf="f.fieldGroup.length > 0">
            <formly-field class="col" [field]="f"></formly-field>
            <div *ngIf="field.templateOptions.trashButton" class="col-1 d-flex align-items-center">
              <button class="btn btn-link text-secondary btn-sm" type="button" (click)="remove(i)" *ngIf="showTrash">
                <i class="fa fa-trash"></i>
              </button>
              <ng-container *ngIf="!showTrash">&nbsp;</ng-container>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class RepeatTypeComponent extends FieldArrayType {

  /**
   * Show trash on right line
   * @returns boolean
   */
  get showTrash() {
    return this.field.fieldGroup.length > (this.to.minLength || 0);
  }
}
