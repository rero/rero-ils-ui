/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { inject, Injectable } from '@angular/core';
import { LoanFixedDateService } from '@app/admin/circulation/services/loan-fixed-date.service';

export interface ICirculationSetting {
  key: string;    /** the setting internal key */
  label: string;  /** the setting label to display to user */
  value: any;     /** the setting value */
  extra?: any;     /** extra element for customization */
}

@Injectable({
  providedIn: 'root'
})
export class CirculationSettingsService {

  private loanFixedDateService: LoanFixedDateService = inject(LoanFixedDateService);

  private checkoutCirculationSettings: ICirculationSetting[] = [];

  add(circulationSetting: ICirculationSetting): void {
    this.checkoutCirculationSettings.push(circulationSetting);
  }

  getSettings(): ICirculationSetting[] {
    return this.checkoutCirculationSettings;
  }

  remove(key: string): ICirculationSetting | ICirculationSetting[] | null {
    const idx = this.checkoutCirculationSettings.findIndex(setting => setting.key === key);
    if (idx >= 0) {
      if (key === 'endDate' && this.checkoutCirculationSettings[idx].extra.remember) {
        this.loanFixedDateService.remove();
      }
      return this.checkoutCirculationSettings.splice(idx, 1);
    }
  }
}
