/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { User, UserService } from '@rero/shared';
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
  form: FormGroup = new FormGroup({});
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
   * @param _modalService - BsModalService
   * @param _bsModalRef - BsModalRef
   * @param _userService - UserService
   * @param _recordService - RecordService
   * @param _http - HttpClient
   * @param _toastr - ToastrService
   * @param _translateService - TranslateService
   * @param _loanService: LoanService
   * @param _itemService: ItemService
   * @param _holdingService: HoldingsService
   */
  constructor(
    private _modalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _userService: UserService,
    private _recordService: RecordService,
    private _http: HttpClient,
    private _toastr: ToastrService,
    private _loanService: LoanService,
    private _translateService: TranslateService,
    private _itemService: ItemsService,
    private _holdingService: HoldingsService,
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this.currentUser = this._userService.user;
    const initialState: any = this._modalService.config.initialState;
    if (initialState.hasOwnProperty('recordPid')) {
      this.closeModal();
    }
    this.recordPid = initialState.recordPid;
    this.recordType = initialState.recordType;
    this.service = (this.recordType === 'item') ? this._itemService : this._holdingService;
    this.requestedBy$ = (this.recordType === 'item') ?  this._loanService.requestedBy$(this.recordPid) : null;
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
    this._http.post(`/api/${this.recordType}/request`, body)
      .pipe(tap(() => this.requestInProgress = false))
      .subscribe(
        (_: unknown) => {
          this.onSubmit.next();
          this.closeModal();
          this._toastr.success(
            this._translateService.instant('Request registered.'),
            this._translateService.instant('Item request')
          );
        },
        (error: unknown) => {
          this._toastr.error(
            this._translateService.instant('An error has occurred. Please try again.'),
            this._translateService.instant('Item request'),
            { disableTimeOut: true }
          );
        }
      );
  }

  /**
   * Close modal dialog
   * @param event - Event
   */
  closeModal() {
    this._bsModalRef.hide();
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
            templateOptions: {
              label: this._translateService.instant('Patron barcode'),
              required: true,
              keydown: (field, event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }
            },
            asyncValidators: {
              userExist: {
                expression: (fc: FormControl) =>  {
                  return new Promise((resolve) => {
                    const value = fc.value;
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
                message: this._translateService.instant('Patron not found.')
              },
              can_request: {
                expression: (fc: FormControl) => {
                  return new Promise((resolve) => {
                    const value = fc.value;
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
                  return this._translateService.instant(
                    this.canRequestMessage
                  );
                }
              }
            }
          },
          {
            key: 'pickupPid',
            type: 'select',
            templateOptions: {
              label: this._translateService.instant('Pickup location'),
              required: true,
              placeholder: this._translateService.instant('Select…'),
              options: pickups
            }
          }
        ];
        if (this.recordType === 'holding') {
          this.formFields.push({
            key: 'description',
            type: 'textarea',
            templateOptions: {
              label: this._translateService.instant('Collection or item year, volume, number, pages'),
              placeholder: this._translateService.instant('Year / Volume / Number / Pages'),
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
    const currentLibrary = this.currentUser.currentLibrary;
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
    return this._recordService.getRecords('patrons', query, 1, 1).pipe(
      debounceTime(500),
      map((result: Record) => this._recordService.totalHits(result.hits.total) === 0 ? [] : result.hits.hits),
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
