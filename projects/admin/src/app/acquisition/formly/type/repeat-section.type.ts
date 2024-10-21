/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
    <p-card>
      <ng-template pTemplate="header">
        @if (field.props.label || field.props.addButton) {
          <label class="col" [ngClass]="field.props.className">
            @if (field.props.label) {
              <span>{{ field.props.label|translate }}</span>
            }
            @if (field.props.addButton) {
              <button type="button"
                      class="btn btn-link text-secondary btn-sm ng-star-inserted"
                      (click)="add()">
                <i class="fa fa-clone"></i>
              </button>
            }
            @if (field.props.selectUnselect) {
              <div class="ml-3 d-inline font-weight-normal">
                <a class="mr-1" (click)="field.props.selectUnselect($event, 'select', field.fieldGroup)" translate>
                  Select all
                </a>
                |
                <a class="ml-1" (click)="field.props.selectUnselect($event, 'unselect', field.fieldGroup)" translate>
                  Deselect all
                </a>
              </div>
            }
          </label>
        }
      </ng-template>
      @if (field.fieldGroup.length > 0) {
        <div class="card-body">
          <div class="row">
            <div [ngClass]="field.props.trashButton ? 'col-11': 'col-12'">
              <div class="row">
                @for (field of field.fieldGroup[0].fieldGroup; track field) {
                  @if (field.className) {
                    <div class="{{ field.props.headerClassName }}">
                      {{ field.props.label|translate }}
                      @if (field.props.required) {
                        &nbsp;*
                      }
                    </div>
                  }
                }
              </div>
            </div>
          </div>
          @for (f of field.fieldGroup; track f; let i = $index) {
            <div class="row" [ngClass]="{ 'bg-light': i % 2 }">
              @if (f.fieldGroup.length > 0) {
                <formly-field class="col" [field]="f"></formly-field>
                @if (field.props.trashButton) {
                  <div class="col-1 d-flex align-items-center">
                    @if (showTrash) {
                      <button class="btn btn-link text-secondary btn-sm" type="button" (click)="remove(i)">
                        <i class="fa fa-trash"></i>
                      </button>
                    } @else {
                      &nbsp;
                    }
                  </div>
                }
              }
            </div>
          }
        </div>
      }
    </p-card>
    <!--
    <div class="card my-2">
      <div class="card-header">
        @if (field.props.label || field.props.addButton) {
          <label class="col" [ngClass]="field.props.className">
            @if (field.props.label) {
              <span>{{ field.props.label|translate }}</span>
            }
            @if (field.props.addButton) {
              <button type="button"
                      class="btn btn-link text-secondary btn-sm ng-star-inserted"
                      (click)="add()">
                <i class="fa fa-clone"></i>
              </button>
            }
            @if (field.props.selectUnselect) {
              <div class="ml-3 d-inline font-weight-normal">
                <a class="mr-1" (click)="field.props.selectUnselect($event, 'select', field.fieldGroup)" translate>
                  Select all
                </a>
                |
                <a class="ml-1" (click)="field.props.selectUnselect($event, 'unselect', field.fieldGroup)" translate>
                  Deselect all
                </a>
              </div>
            }
          </label>
        }
      </div>
      @if (field.fieldGroup.length > 0) {
        <div class="card-body">
          <div class="row">
            <div [ngClass]="field.props.trashButton ? 'col-11': 'col-12'">
              <div class="row">
                @for (field of field.fieldGroup[0].fieldGroup; track field) {
                  @if (field.className) {
                    <div class="{{ field.props.headerClassName }}">
                      {{ field.props.label|translate }}
                      @if (field.props.required) {
                        &nbsp;*
                      }
                    </div>
                  }
                }
              </div>
            </div>
          </div>
          @for (f of field.fieldGroup; track f; let i = $index) {
            <div class="row" [ngClass]="{ 'bg-light': i % 2 }">
              @if (f.fieldGroup.length > 0) {
                <formly-field class="col" [field]="f"></formly-field>
                @if (field.props.trashButton) {
                  <div class="col-1 d-flex align-items-center">
                    @if (showTrash) {
                      <button class="btn btn-link text-secondary btn-sm" type="button" (click)="remove(i)">
                        <i class="fa fa-trash"></i>
                      </button>
                    } @else {
                      &nbsp;
                    }
                  </div>
                }
              }
            </div>
          }
        </div>
      }
    </div>
    -->
  `
})
export class RepeatTypeComponent extends FieldArrayType {

  /**
   * Show trash on right line
   * @returns boolean
   */
  get showTrash() {
    return this.field.fieldGroup.length > (this.props.minLength || 0);
  }
}
