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

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CirculationPolicyService } from '../circulation-policy.service';
import { CirculationPolicyFormService } from '../circulation-policy-form.service';
import { CirculationPolicy } from '../circulation-policy';
import { CirculationMappingService } from '../circulation-mapping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../service/user.service';
import { RecordService, UniqueValidator, ApiService } from '@rero/ng-core';
import { Location } from '@angular/common';


@Component({
  selector: 'admin-circulation-settings-circulation-policy',
  templateUrl: './circulation-policy.component.html',
  styles: []
})
export class CirculationPolicyComponent implements OnInit {

  private circulationPolicy: CirculationPolicy;

  public circulationForm: FormGroup;

  public librariesOrg = [];

  public organisation;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private circulationPolicyService: CirculationPolicyService,
    private circulationPolicyForm: CirculationPolicyFormService,
    private userService: UserService,
    private circulationMapping: CirculationMappingService,
    private apiService: ApiService,
    private recordService: RecordService,
    private location: Location
    ) { }

    ngOnInit() {
      const user = this.userService.getCurrentUser();
      if (user) {
        this.route.params.subscribe(params => {
          const pid = params.pid ? params.pid : null;
          this.circulationPolicyService
          .loadOrCreateCirculationPolicy(pid)
          .subscribe((circulation: CirculationPolicy) => {
            circulation.organisation.$ref = this.apiService.getRefEndpoint('organisations', user.library.organisation.pid);
            this.circulationPolicy = circulation;
            // Load organisation
            this.recordService.getRecord('organisations', user.library.organisation.pid)
            .subscribe(data => this.organisation = data.metadata);
            // Load all required elements
            this.circulationPolicyService.loadAllItemTypesPatronTypesCirculationPolicies().subscribe(
              ([itemTypes, patronTypes, circulations]: any) => {
                this.circulationMapping.generate(itemTypes, patronTypes, circulations, circulation);
                this.circulationMapping.setPolicyLevel(circulation.policy_library_level);
                this.recordService.getRecords('libraries', '', 1, RecordService.MAX_REST_RESULTS_SIZE)
                .subscribe((libraries: any) => {
                  libraries.hits.hits.forEach(library => {
                    this.librariesOrg.push({
                      id: library.metadata.pid,
                      name: library.metadata.name
                    });
                    this.circulationPolicyForm.populate(this.circulationPolicy);
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

      allowCheckoutCheckbox(checkbox: boolean) {
        if (!this.allow_checkout.value) {
          this.checkout_duration.setValue(null);
          this.allow_renewals.setValue(false);
          this.number_renewals.setValue(null);
          this.renewal_duration.setValue(null);
          this.number_of_days_after_due_date.setValue(null);
          this.number_of_days_before_due_date.setValue(null);
          this.reminder_fee_amount.setValue(null);
        }
      }

      allowRenewalsCheckbox(checkbox: boolean) {
        if (!this.allow_renewals.value) {
          this.number_renewals.setValue(null);
          this.renewal_duration.setValue(null);
        }
      }

      numberRenewalsCheck() {
        if (this.number_renewals.value < 1) {
          this.renewal_duration.setValue(null);
        }
      }

      policyLevelEvent(level: boolean) {
        this.circulationMapping.setPolicyLevel(level);
        this.getField('settings').setValue([]);
        if (!level) {
          this.getField('libraries').setValue([]);
        }
      }

      libraryCheck(libraryPid: string) {
        const librariesControl = this.getField('libraries');
        return librariesControl.value.indexOf(libraryPid) >= 0;
      }

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

      patronTypes() {
        return this.circulationMapping.getPatronTypes();
      }

      isPatronTypeChecked(patronTypeId: string) {
        const settingsControl = this.getField('settings');
        return patronTypeId in settingsControl.value;
      }

      isPatronTypeDisabled(patronTypeId: string) {
        return this.circulationMapping.isPatronTypeDisabled(patronTypeId);
      }

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

      itemTypes() {
        return this.circulationMapping.getItemTypes();
      }

      isItemTypeChecked(patronTypeId: string, itemTypeId: string) {
        const settingsControl = this.getField('settings');
        return settingsControl.value[patronTypeId].indexOf(itemTypeId) > -1;
      }

      isItemTypeDisabled(patronTypeId: string, itemTypeId: string) {
        return this.circulationMapping.isItemTypeDisabled(
          patronTypeId,
          itemTypeId
          );
      }

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
          if (values[patronTypeId].length === 0) {
            delete values[patronTypeId];
          }
      }

      onSubmit() {
        this.circulationPolicy.update(this.circulationPolicyForm.getValues());
        this.circulationPolicyService.save(this.circulationPolicy);
      }

      onCancel(event) {
        event.preventDefault();
        this.location.back();
      }

      getField(field: string) {
        return this.circulationPolicyForm.getControlByFieldName(field);
      }

      /* Control Fields */
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
        return this.organisation.default_currency;
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
