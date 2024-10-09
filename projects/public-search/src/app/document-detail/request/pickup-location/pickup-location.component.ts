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
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { HoldingsApiService } from '../../../api/holdings-api.service';
import { ItemApiService } from '../../../api/item-api.service';
import { LocationApiService } from '../../../api/location-api.service';

@Component({
  selector: 'public-search-pickup-location',
  templateUrl: './pickup-location.component.html'
})
export class PickupLocationComponent implements OnInit {

  private locationApiService: LocationApiService = inject(LocationApiService);
  private itemApiService: ItemApiService = inject(ItemApiService);
  private holdingsApiService: HoldingsApiService = inject(HoldingsApiService);
  private translateService: TranslateService = inject(TranslateService);

  /** Record: item or holding */
  @Input() record: any;

  /** Record type */
  @Input() recordType: string;

  /** View code */
  @Input() viewcode: string;

  /** Item count */
  @Input() itemCount = 0;

  /** Close request dialog event */
  @Output() closeEvent = new EventEmitter<boolean>();

  /** Form */
  form = new UntypedFormGroup({});
  fields: FormlyFieldConfig[] = [];
  model: any = {};

  /** Show form */
  showForm = true;

  /** Request in progress */
  requestInProgress = false;

  /** Record requested */
  requested = false;

  /** Record API request */
  apiRequest = null;

  /** User message */
  requestMessage: {
    success: boolean,
    message: string
  };

  /** OnInit hook */
  ngOnInit(): void {
    this.locationApiService
      .getPickupLocationsByRecordId(this.recordType, this.record.metadata.pid)
      .subscribe((pickups: any) => {
        const options = [];
        pickups.forEach((pickup: any) => {
          options.push({label: pickup.name, value: pickup.pid });
        });
        // Text area Year/Volume/Number/Pages
        if (this.recordType === 'holding') {
          this.fields.push({
            key: 'description',
            type: 'textarea',
            props: {
              label: this.translateService.instant('Collection or item year, volume, number, pages'),
              placeholder: this.translateService.instant('Year / Volume / Number / Pages'),
              maxLength: 100,
              required: true,
            }
          });
        }
        // Menu to select pickup location
        this.fields.push({
          key: `pickup`,
          type: 'select',
          props: {
            label: this.translateService.instant('Pickup location'),
            required: true,
            options
          }
        });
      });
  }

  /** Close request dialog */
  closeDialog(): void {
    this.closeEvent.emit(true);
  }

  /** Submit form */
  submit() {
    this.requestInProgress = true;
    if (this.recordType === 'holding') {
      this.apiRequest = this.holdingsApiService.request({
        holding_pid: this.record.metadata.pid,
        pickup_location_pid: this.model.pickup,
        description: this.model.description,
      });
    } else if (this.recordType === 'item') {
      this.apiRequest = this.itemApiService.request({
        item_pid: this.record.metadata.pid,
        pickup_location_pid: this.model.pickup,
      });
    }

    this.apiRequest.pipe(tap(() => {
      this.showForm = false;
      this.requestInProgress = false;
      this.requested = true;
    }))
    .subscribe(
      () => {
        this.requestMessage = {
          success: true,
          message: this.translateService.instant('Your request has been placed.')
        };
      },
      () => {
        this.requestMessage = {
          success: false,
          message: this.translateService.instant('Error on this request.')
        };
      }
    );
  }
}
