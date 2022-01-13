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

export const formConfiguration = [
  {
    key: 'from',
    type: 'input',
    templateOptions: {
      label: 'Time period',
      addonLeft: {
        text: 'From'
      },
      addonRight: {
        class: 'fa fa-calendar'
      }
    }
  }, {
    key: 'to',
    type: 'input',
    templateOptions: {
      addonLeft: {
        text: 'To'
      },
      addonRight: {
        class: 'fa fa-calendar'
      }
    }
  }, {
    key: 'interval',
    type: 'number',
    templateOptions: {
      label: 'Step interval',
      min: 5,
      addonLeft: {
        class: 'fa fa-clock-o'
      },
      addonRight: {
        text: 'min.'
      }
    }
  }, {
    key: 'operation',
    type: 'multicheckbox',
    templateOptions: {
      label: 'Operations',
      options: [
        { value: 'checkout', label: 'Checkout' },
        { value: 'checkin', label: 'Checkin' },
        { value: 'extend', label: 'Extend' },
        { value: 'request', label: 'Request' },
      ]
    }
  }
];

/** Interface to manage fields on form */
export interface FormModel {
  from?: string;
  to?: string;
  interval?: number;
  operation?: any;
}
