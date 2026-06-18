// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, OnInit, output, signal, ChangeDetectionStrategy} from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { HoldingsApiService } from '../../../api/holdings-api.service';
import { ItemApiService } from '../../../api/item-api.service';
import { LocationApiService } from '../../../api/location-api.service';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';

@Component({
    selector: 'public-search-pickup-location',
    templateUrl: './pickup-location.component.html',
    imports: [Message, FormsModule, ReactiveFormsModule, FormlyModule, Button, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickupLocationComponent implements OnInit {

  private locationApiService: LocationApiService = inject(LocationApiService);
  private itemApiService: ItemApiService = inject(ItemApiService);
  private holdingsApiService: HoldingsApiService = inject(HoldingsApiService);
  private translateService: TranslateService = inject(TranslateService);

  /** Record: item or holding */
  record = input<any>();

  /** Record type */
  recordType = input<string>();

  /** View code */
  viewcode = input<string>();

  /** Item count */
  itemCount = input(0);

  /** Close request dialog event */
  closeEvent = output<boolean>();

  /** Form */
  form = new UntypedFormGroup({});
  readonly fields = signal<FormlyFieldConfig[]>([]);
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
  readonly requestMessage = signal<{success: boolean, message: string} | null>(null);

  /** OnInit hook */
  ngOnInit(): void {
    this.locationApiService
      .getPickupLocationsByRecordId(this.recordType(), this.record()?.metadata?.pid)
      .subscribe((pickups: any) => {
        const options = [];
        pickups.forEach((pickup: any) => {
          options.push({label: pickup.name, value: pickup.pid });
        });
        const newFields: FormlyFieldConfig[] = [];
        // Text area Year/Volume/Number/Pages
        if (this.recordType() === 'holding') {
          newFields.push({
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
        newFields.push({
          key: `pickup`,
          type: 'select',
          props: {
            label: this.translateService.instant('Pickup location'),
            filter: true,
            appendTo: 'body',
            required: true,
            options
          }
        });
        this.fields.set(newFields);
      });
  }

  /** Close request dialog */
  closeDialog(): void {
    this.closeEvent.emit(true);
  }

  /** Submit form */
  submit() {
    this.requestInProgress = true;
    if (this.recordType() === 'holding') {
      this.apiRequest = this.holdingsApiService.request({
        holding_pid: this.record()?.metadata?.pid,
        pickup_location_pid: this.model.pickup,
        description: this.model.description,
      });
    } else if (this.recordType() === 'item') {
      this.apiRequest = this.itemApiService.request({
        item_pid: this.record()?.metadata?.pid,
        pickup_location_pid: this.model.pickup,
      });
    }

    this.apiRequest.pipe(
      tap(() => {
        this.showForm = false;
        this.requestInProgress = false;
        this.requested = true;
      }),
      tap(() => this.closeDialog()),
    ).subscribe(
      () => {
        this.requestMessage.set({
          success: true,
          message: this.translateService.instant('Your request has been placed.')
        });
      },
      () => {
        this.requestMessage.set({
          success: false,
          message: this.translateService.instant('Error on this request.')
        });
      }
    );
  }
}
