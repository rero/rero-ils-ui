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
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { ItemApiService } from '../../../api/item-api.service';
import { LocationApiService } from '../../../api/location-api.service';
import { UserService } from '../../../user.service';

@Component({
  selector: 'public-search-pickup-location',
  templateUrl: './pickup-location.component.html'
})
export class PickupLocationComponent implements OnInit {

  /** Item record */
  @Input() item: any;

  /** View code */
  @Input() viewcode: string;

  /** Form */
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model: any = {};

  /** Show form */
  showForm = true;

  /** Request in progress */
  requestInProgress = false;

  /** Item requested */
  requested = false;

  /** User message */
  requestMessage: {
    success: boolean,
    message: string
  };

  /**
   * Construtor
   * @param _locationApiService - LocationApiService
   * @param _userService - UserService
   * @param _itemApiService - ItemApiService
   * @param _translateService - TranslateService
   */
  constructor(
    private _locationApiService: LocationApiService,
    private _userService: UserService,
    private _itemApiService: ItemApiService,
    private _translateService: TranslateService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    this._locationApiService
      .getPickupLocationsByItemId(this.item.metadata.pid)
      .subscribe((pickups: any) => {
        const options = [];
        pickups.forEach((pickup: any) => {
          options.push({label: pickup.name, value: pickup.pid });
        });
        this.fields.push({
          key: `pickup`,
          type: 'select',
          templateOptions: {
            label: this._translateService.instant('Pickup location'),
            required: true,
            options
          }
        });
      });
  }

  /** Submit form */
  submit() {
    const user = this._userService.user;
    this.requestInProgress = true;
    this._itemApiService.request({
      item_pid: this.item.metadata.pid,
      pickup_location_pid: this.model.pickup,
      patron_pid: user.pid,
      transaction_location_pid: this.model.pickup,
      transaction_user_pid: user.pid
    })
    .pipe(tap(() => {
      this.showForm = false;
      this.requestInProgress = false;
      this.requested = true;
    }))
    .subscribe(
      (response) => {
        this.requestMessage = {
          success: true,
          message: this._translateService.instant('A request has been placed on this item.')
        };
      },
      (error) => {
        this.requestMessage = {
          success: false,
          message: this._translateService.instant('Error on this request.')
        };
      }
    );
  }
}
