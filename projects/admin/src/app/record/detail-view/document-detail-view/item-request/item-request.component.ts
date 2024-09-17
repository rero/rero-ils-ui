/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { User, UserService } from '@rero/shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { debounceTime, map, shareReplay, tap } from 'rxjs/operators';
import { HoldingsService } from '../../../../service/holdings.service';
import { ItemsService } from '../../../../service/items.service';
import { LoanService } from '../../../../service/loan.service';

@Component({
  selector: 'admin-item-request',
  templateUrl: './item-request.component.html'
})
export class ItemRequestComponent implements OnInit {

  private messageService:MessageService = inject(MessageService);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  // COMPONENTS ATTRIBUTES ====================================================
  /** Record pid */
  recordPid: string;
  /** Record description */
  description: string;
  /** Record type */
  recordType: string;
  /** Service */
  service: any;
  /** form */
  form: UntypedFormGroup = new UntypedFormGroup({});
  /** form fields */
  formFields: FormlyFieldConfig[];
  /** model */
  model: FormModel;
  /** patron record */
  patron: any;
  /** Dynamic message for can_request validator */
  canRequestMessage: string;
  /** On submit event */
  onSubmit: EventEmitter<any> = new EventEmitter();
  /** Requested item(s) */
  requestedBy$: Observable<any>;
  /** Request in progress */
  requestInProgress = false;

  /** Pickup default $ref */
  private pickupDefaultValue: string;
  /** Current user */
  private currentUser: User;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param userService - UserService
   * @param recordService - RecordService
   * @param http - HttpClient
   * @param translateService - TranslateService
   * @param loanService: LoanService
   * @param itemService: ItemService
   * @param holdingService: HoldingsService
   */
  constructor(
    private userService: UserService,
    private recordService: RecordService,
    private http: HttpClient,
    private loanService: LoanService,
    private translateService: TranslateService,
    private itemService: ItemsService,
    private holdingService: HoldingsService,
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this.currentUser = this.userService.user;
    const initialState: any = this.dynamicDialogConfig.data.initialState;
    if (!Object.hasOwn(initialState, 'recordPid')) {
      this.closeModal();
    }
    this.recordPid = initialState.recordPid;
    this.recordType = initialState.recordType;
    this.service = (this.recordType === 'item') ? this.itemService : this.holdingService;
    this.requestedBy$ = (this.recordType === 'item') ?  this.loanService.requestedBy$(this.recordPid) : null;
    this.initForm();
  }

  // COMPONENTS FUNCTIONS =====================================================
  /**
   * Submit form
   * @param model - Object
   */
  submit(model: FormModel) {
    this.requestInProgress = true;
    let body = {};
    let key;
    body = {
      pickup_location_pid: model.pickupPid,
      patron_pid: this.patron.pid,
      transaction_library_pid: this.currentUser.currentLibrary,
      transaction_user_pid: this.currentUser.patronLibrarian.pid
    };
    if (this.recordType === 'item') {
      key = 'item_pid';
      body[key] = this.recordPid;
    } else if (this.recordType === 'holding') {
      key = 'holding_pid';
      body[key] = this.recordPid;
      key = 'description';
      body[key] = model.description;
    }
    this.http.post(`/api/${this.recordType}/request`, body)
      .pipe(tap(() => this.requestInProgress = false))
      .subscribe({
        next: (_: unknown) => {
          this.onSubmit.next(undefined);
          this.closeModal(true);
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Item request'),
            detail: this.translateService.instant('Request registered.')
          });
        },
        error: (error: unknown) => this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Item request'),
          detail: this.translateService.instant('An error has occurred. Please try again.'),
          sticky: true,
          closable: true
        })
      });
  }

  /**
   * Close modal dialog
   * @param event - Event
   */
  closeModal(value?: boolean) {
    this.dynamicDialogRef.close(value);
  }

  /**
   * Init form
   */
  initForm() {
    if (this.currentUser) {
      this.getPickupLocations().subscribe(pickups => {
        this.formFields = [
          {
            key: 'patronBarcode',
            type: 'input',
            focus: true,
            props: {
              label: this.translateService.instant('Patron barcode'),
              required: true,
              keydown: (field, event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }
            },
            asyncValidators: {
              userExist: {
                expression: (fc: UntypedFormControl) =>  {
                  return new Promise((resolve) => {
                    const { value } = fc;
                    if (value.length > 2) {
                      this.getPatron(fc.value).subscribe((result: any) => {
                        this.patron = (result.length === 1)
                          ? this.patron = result[0].metadata
                          : null;
                        resolve(result.length === 1);
                      });
                    }
                  });
                },
                message: this.translateService.instant('Patron not found.')
              },
              can_request: {
                expression: (fc: UntypedFormControl) => {
                  return new Promise((resolve) => {
                    const { value } = fc;
                    if (value.length > 2) {
                      this.service.canRequest(
                        this.recordPid,
                        this.currentUser.currentLibrary,
                        value
                      ).subscribe((result: any) => {
                        if (!result.can) {
                          const reasons = result.reasons.others || {'Not defined error': true};
                          this.canRequestMessage = Object.keys(reasons)[0];
                        }
                        resolve(result.can);
                      });
                    }
                  });
                },
                message: () => {
                  return this.translateService.instant(
                    this.canRequestMessage
                  );
                }
              }
            }
          },
          {
            key: 'pickupPid',
            type: 'select',
            props: {
              label: this.translateService.instant('Pickup location'),
              required: true,
              placeholder: this.translateService.instant('Select…'),
              options: pickups
            }
          }
        ];
        if (this.recordType === 'holding') {
          this.formFields.push({
            key: 'description',
            type: 'input',
            props: {
              label: this.translateService.instant('Collection or item year, volume, number, pages'),
              placeholder: this.translateService.instant('Year / Volume / Number / Pages'),
              maxLength: 100,
              required: true,
            }
          });
        }
        this.model = {
          patronBarcode: null,
          pickupPid: this.pickupDefaultValue,
          description: null,
        };
      });
    }
  }


  /** Get pickup location available for the item
   *  @return observable with pickup locations informations (name and pid)
   */

  private getPickupLocations(): Observable<Array<any>> {
    const { currentLibrary } = this.currentUser;
    return this.service.getPickupLocations(this.recordPid).pipe(
      map((locations: any) => locations.map((loc: any) => {
        if (this.pickupDefaultValue === undefined && loc.library.pid === currentLibrary) {
          this.pickupDefaultValue = loc.pid;
        }
        return {
          label: loc.pickup_name || loc.name,
          value: loc.pid
        };
      }))
    );
  }

  /**
   * Get patron record by barcode
   * @param barcode - string
   * @return observable
   */
  private getPatron(barcode: string) {
    const query = `barcode:${barcode}`;
    return this.recordService.getRecords('patrons', query, 1, 1).pipe(
      debounceTime(500),
      map((result: Record) => this.recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
      shareReplay(1)
    );
  }
}

/**
 * Interface to define fields on form
 */
interface FormModel {
  patronBarcode: string;
  pickupPid: string;
  description?: string;
}
