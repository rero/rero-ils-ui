/*
 * RERO ILS UI
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

import { Location, getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService, RecordService, UniqueValidator } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { CirculationMappingService } from '../circulation-mapping.service';
import { CirculationPolicy } from '../circulation-policy';
import { CirculationPolicyFormService } from '../circulation-policy-form.service';
import { CirculationPolicyService } from '../circulation-policy.service';


@Component({
  selector: 'admin-circulation-settings-circulation-policy',
  templateUrl: './circulation-policy.component.html',
  styleUrls: [ './circulation-policy.component.scss']
})
export class CirculationPolicyComponent implements OnInit {

  /** Circulation policy */
  private _circulationPolicy: CirculationPolicy;

  /** Circulation form */
  public circulationForm: FormGroup;

  /** Libraries of current organisation */
  public librariesOrg = [];

  /** Current organisation */
  public organisation: any;

  /**
   * Constructor
   * @param route - AcivatedRoute
   * @param circulationPolicyService - CirculationPolicyService
   * @param circulationPolicyForm - CirculationPolicyFormService
   * @param userService - UserService
   * @param circulationMapping - CirculationMappingService
   * @param apiService - ApiService
   * @param recordService - RecordService
   * @param location - Location
   */
  constructor(
    private route: ActivatedRoute,
    private circulationPolicyService: CirculationPolicyService,
    private circulationPolicyForm: CirculationPolicyFormService,
    private userService: UserService,
    private circulationMapping: CirculationMappingService,
    private apiService: ApiService,
    private recordService: RecordService,
    private location: Location
    ) { }

    /** On init hook */
    ngOnInit() {
      const user = this.userService.user;
      if (user) {
        this.route.params.subscribe(params => {
          const pid = params.pid ? params.pid : null;
          this.circulationPolicyService
          .loadOrCreateCirculationPolicy(pid)
          .subscribe((circulation: CirculationPolicy) => {
            circulation.organisation.$ref = this.apiService.getRefEndpoint('organisations', user.currentOrganisation);
            this._circulationPolicy = circulation;
            // Load organisation
            this.recordService.getRecord('organisations', user.currentOrganisation)
            .subscribe(data => this.organisation = data.metadata);
            // Load all required elements
            this.circulationPolicyService.loadAllItemTypesPatronTypesCirculationPolicies().subscribe(
              ([itemTypes, patronTypes, circulations]: any) => {
                this.circulationMapping.generate(itemTypes, patronTypes, circulations, circulation);
                this.circulationMapping.setPolicyLevel(circulation.policy_library_level);
                this.recordService.getRecords('libraries', '', 1, RecordService.MAX_REST_RESULTS_SIZE)
                .subscribe((libraries: any) => {
                  libraries.hits.hits.forEach((library: any) => {
                    this.librariesOrg.push({
                      id: library.metadata.pid,
                      name: library.metadata.name
                    });
                    this.circulationPolicyForm.populate(this._circulationPolicy);
                    this.circulationForm = this.circulationPolicyForm.getForm();
                    this.circulationForm.controls.name.setAsyncValidators([
                      UniqueValidator.createValidator(
                        this.recordService,
                        'circ_policies',
                        'circ_policy_name',
                        circulation.pid
                        )
                      ]);
                    });
                  });
                });
            });
          });
        }
      }

      /**
       * Display the settings and the libraries according to the cipo level
       * @param level - cipo level
       */
      policyLevelEvent(level: boolean) {
        this.circulationMapping.setPolicyLevel(level);
        this.getField('settings').setValue([]);
        if (!level) {
          this.getField('libraries').setValue([]);
        }
      }

      /**
       * Check if the library is linked to the cipo
       * @param libraryPid - library pid
       *
       * @returns true or false
       */
      libraryCheck(libraryPid: string) {
        const librariesControl = this.getField('libraries');
        return librariesControl.value.indexOf(libraryPid) >= 0;
      }

      /**
       * Adds or remove the library to the list if its checked or not
       * @param checkbox - is checked or not
       * @param libraryId - library id
       */
      libraryClickEvent(checkbox: boolean, libraryId: string) {
        const values = this.getField('libraries').value;
        if (checkbox) {
          if (values.indexOf(libraryId) === -1) {
            values.push(libraryId);
          }
        } else {
          const index = values.indexOf(libraryId);
          if (index >= 0) {
            values.splice(index, 1);
          }
        }
      }

      /**
       * Get patron types list
       */
      patronTypes() {
        return this.circulationMapping.getPatronTypes();
      }

      /**
       * Is patron type checked
       * @param patronTypeId - patron type id
       */
      isPatronTypeChecked(patronTypeId: string) {
        const settingsControl = this.getField('settings');
        return patronTypeId in settingsControl.value;
      }

      /**
       * Is patron type disabled
       * @param patronTypeId - patron type id
       */
      isPatronTypeDisabled(patronTypeId: string) {
        return this.circulationMapping.isPatronTypeDisabled(patronTypeId);
      }

      /**
       * Add or remove patron type in settings if it's checked or not
       * @param checkbox - is checked or not
       * @param patronTypeId - patron type id
       */
      patronTypeClickEvent(checkbox: boolean, patronTypeId: string) {
        const settings = this.getField('settings').value;
        if (checkbox) {
          if ((settings.indexOf(patronTypeId) === -1)) {
            settings[patronTypeId] = [];
          }
        } else {
          delete settings[patronTypeId];
        }
      }

      /**
       * Get item types list
       */
      itemTypes() {
        return this.circulationMapping.getItemTypes();
      }

      /**
       * Control if item type is checked
       * @param patronTypeId - patron type id
       * @param itemTypeId - item type id
       */
      isItemTypeChecked(patronTypeId: string, itemTypeId: string) {
        const settingsControl = this.getField('settings');
        return settingsControl.value[patronTypeId].indexOf(itemTypeId) > -1;
      }

      /**
       * Check if item type is disabled
       * @param patronTypeId - patron type id
       * @param itemTypeId - item type id
       */
      isItemTypeDisabled(patronTypeId: string, itemTypeId: string) {
        return this.circulationMapping.isItemTypeDisabled(
          patronTypeId,
          itemTypeId
          );
      }

      /**
       * Adds or remove item type link to patron type if it's checked or not
       * @param checkbox - is checked or not
       * @param patronTypeId - patron type id
       * @param itemTypeId - item type id
       */
      itemTypeClickEvent(
        checkbox: boolean,
        patronTypeId: string,
        itemTypeId: string
        ) {
          const settingsControl = this.getField('settings');
          const values = settingsControl.value;
          if (checkbox) {
            values[patronTypeId].push(itemTypeId);
          } else {
            const index = values[patronTypeId].indexOf(itemTypeId);
            values[patronTypeId].splice(index, 1);
          }
      }

      /**
       * Submit form
       */
      onSubmit() {
        this.circulationPolicyService.save({
          $schema: this._circulationPolicy.$schema,
          pid: this._circulationPolicy.pid,
          organisation: this._circulationPolicy.organisation,
          ...this.circulationPolicyForm.getValues()});
      }

      /**
       * Cancel form and go back to previous page
       * @param event - click event
       */
      onCancel(event: any) {
        event.preventDefault();
        this.location.back();
      }

      /**
       * Get field by name
       * @param field - field name
       */
      getField(field: string) {
        return this.circulationPolicyForm.getControlByFieldName(field);
      }

      /* Get form controls to use them in template */
      get name() {
        return this.getField('name');
      }
      get description() {
        return this.getField('description');
      }
      get allow_checkout() {
        return this.getField('allow_checkout');
      }
      get allow_requests() {
        return this.getField('allow_requests');
      }
      get allow_renewals() {
        return this.getField('allow_renewals');
      }
      get number_of_days_after_due_date() {
        return this.getField('number_of_days_after_due_date');
      }
      get number_of_days_before_due_date() {
        return this.getField('number_of_days_before_due_date');
      }
      get checkout_duration() {
        return this.getField('checkout_duration');
      }
      get number_renewals() {
        return this.getField('number_renewals');
      }
      get renewal_duration() {
        return this.getField('renewal_duration');
      }
      get reminder_fee_amount() {
        return this.getField('reminder_fee_amount');
      }
      get currency() {
        return getCurrencySymbol(this.organisation.default_currency, 'wide');
      }
      get loan_expiry_notice() {
        return this.getField('loan_expiry_notice');
      }
      get send_first_reminder() {
        return this.getField('send_first_reminder');
      }
      get policy_library_level() {
        return this.getField('policy_library_level');
      }
      get is_default() {
        return this.getField('is_default');
      }
      get libraries() {
        return this.getField('libraries');
      }
    }
