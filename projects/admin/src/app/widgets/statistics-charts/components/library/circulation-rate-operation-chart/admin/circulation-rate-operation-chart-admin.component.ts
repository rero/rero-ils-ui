/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formConfiguration, FormModel } from './form-configuration';
import { predefinedSettings} from './settings';

@Component({
  selector: 'admin-stat-chart-library-circulation-admin',
  templateUrl: './circulation-rate-operation-chart-admin.component.html'
})
export class CirculationRateOperationChartAdminComponent implements OnInit {

  /** form group */
  form: FormGroup = new FormGroup({});
  /** form model */
  model: FormModel;
  /** form configuration */
  formFields: FormlyFieldConfig[] = formConfiguration;
  /** widget settings */
  settings: any;
  /** the predefined settings than user could choose to quickly fill the form. */
  predefinedSettings = predefinedSettings;

  /** event to emit setting to parent widget */
  settingsEvent: EventEmitter<any> = new EventEmitter();

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param bsModalRef: BsModalRef
   * @param _translateService: TranslateService
   */
  constructor(
    public bsModalRef: BsModalRef,
    private _translateService: TranslateService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    this.model = {
      from: this.settings.statisticsFilters.from,
      to: this.settings.statisticsFilters.to,
      interval: this.settings.statisticsFilters.interval,
      operation: this.settings.statisticsFilters.operation
    };
  }

  // COMPONENT PUBLIC FUNCTIONS ===============================================
  /**
   * Handle form submission.
   * Format and send form data to parent widget using `settingEvent` event emitter.
   */
  onSubmitForm() {
    // Build settings as widget need to do (same structure as initial state value)
    const values = {
      statisticsFilters: {
        from: this.model.from,
        to: this.model.to,
        interval: this.model.interval,
        operation: this.model.operation
      }
    };
    this.settingsEvent.emit(values);
    this.bsModalRef.hide();
  }


  /**
   * Handle select/change event on predefined settings
   * @param event: the trigger event.
   */
  chooseSetting(event: Event){
    const targetElement = event.target as HTMLSelectElement;
    this.model = {...this.model, ...this.predefinedSettings[targetElement.value]};
    targetElement.selectedIndex = 0;
  }


}
