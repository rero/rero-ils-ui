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
import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../service/user.service';
import { debounceTime, map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'admin-item-request',
  templateUrl: './item-request.component.html'
})
export class ItemRequestComponent implements OnInit {

  /** Item pid */
  private itemPid: string;

  /** Pickup default $ref */
  private pickupDefaultValue: string;

  /** Current user */
  private currentUser: any;

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

  /**
   * Constructor
   * @param _modalService - BsModalService
   * @param _bsModalRef - BsModalRef
   * @param _userService - UserService
   * @param _recordService - RecordService
   * @param _http - HttpClient
   * @param _toastr - ToastrService
   * @param _translateService - TranslateService
   */
  constructor(
    private _modalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private _userService: UserService,
    private _recordService: RecordService,
    private _http: HttpClient,
    private _toastr: ToastrService,
    private _translateService: TranslateService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this.currentUser = this._userService.getCurrentUser();
    const initialState: any = this._modalService.config.initialState;
    if (initialState.hasOwnProperty('itemPid')) {
      this.closeModal();
    }
    this.itemPid = initialState.itemPid;
    this.initForm();
  }

  /**
   * Submit form
   * @param model - Object
   */
  submit(model: FormModel) {
    const body = {
      item_pid: this.itemPid,
      pickup_location_pid: model.pickupPid,
      patron_pid: this.patron.pid,
    };
    this._http.post('/api/item/request', body).subscribe(
      () => {
        this.onSubmit.next();
        this.closeModal();
        this._toastr.success(
          this._translateService.instant('Request registered.'),
          this._translateService.instant('Item request')
        );
      },
      () => {
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
      const organisationPid = this.currentUser.library.organisation.pid;
      this.getPickupsByOrganisation(organisationPid).subscribe(pickups => {
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
                        if (result.length === 1) {
                          this.patron = result[0].metadata;
                        } else {
                          this.patron = undefined;
                        }
                        resolve((result.length === 1) ? true : false);
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
                      const libraryPid = this.currentUser.library.pid;
                      const patronBarcode = fc.value;
                      const itemPid = this.itemPid;
                      this._http.get(`/api/item/${itemPid}/can_request/${libraryPid}/${patronBarcode}`)
                      .subscribe((result: any) => {
                        if (!result.can_request) {
                          this.canRequestMessage = result.reason;
                          resolve(false);
                        } else {
                          resolve(true);
                        }
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
        this.model = {
          patronBarcode: null,
          pickupPid: this.pickupDefaultValue
        };
      });
    }
  }

  /**
   * Get pickups by organisation pid
   * @param organisationPid - string
   * @return observable
   */
  private getPickupsByOrganisation(organisationPid: string) {
    const currentLibrary = this.currentUser.currentLibrary;
    const query = `is_pickup:true AND organisation.pid:${organisationPid}`;
    return this._recordService.getRecords(
      'locations', query, 1, RecordService.MAX_REST_RESULTS_SIZE,
      undefined, undefined, undefined, 'pickup_name'
    ).pipe(
      map(result => result.hits.total === 0 ? [] : result.hits.hits),
      map(results => results.map((result: any) => result.metadata)),
      map(results => results.map((result: any) => {
        if (
          this.pickupDefaultValue === undefined
          && result.library.pid === currentLibrary
        ) {
          this.pickupDefaultValue = result.pid;
        }
        return {
          label: result.pickup_name,
          value: result.pid
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
      map(result => result.hits.total === 0 ? [] : result.hits.hits),
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
}
