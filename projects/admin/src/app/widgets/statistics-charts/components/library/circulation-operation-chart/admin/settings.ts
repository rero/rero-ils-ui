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

import { FormModel } from './form-configuration';
import { currentYearDates, lastMonthDates, lastYearDates } from '../../../../utils';

export const predefinedSettings: {[key: string]: FormModel} = {
  'last_30days': { from: 'now-30d', to: 'now', interval: {value: 1, unity: 'd'}},
  'last_month': {...lastMonthDates(), ...{interval: {value: 1, unity: 'd'}}},
  'last_365days': { from: 'now-1y', to: 'now', interval: {value: 7, unity: 'd'}},
  'last_year': {...lastYearDates(), ...{interval: {value: 7, unity: 'd'}}},
  'this_year': {...currentYearDates(), ...{interval: {value: 7, unity: 'd'}}},
};
