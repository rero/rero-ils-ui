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
    key: 'interval.value',
    type: 'number',
    templateOptions: {
      label: 'Step inverval',
      min: 1
    }
  }, {
    key: 'interval.unity',
    type: 'select',
    templateOptions: {
      options: [
        { value: 'ms', label: 'microsecond' },
        { value: 's', label: 'second' },
        { value: 'm', label: 'minute' },
        { value: 'h', label: 'hour' },
        { value: 'd', label: 'day' },
        { value: 'M', label: 'month' },
        { value: 'q', label: 'quarter' },
        { value: 'y', label: 'year' },
      ]
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
      ]
    }
  }, {
    key: 'autoRefreshEnable',
    type: 'checkbox',
    templateOptions: {
      label: 'Auto-refresh'
    }
  }, {
    key: 'autoRefreshDelay',
    type: 'number',
    templateOptions: {
      placeholder: 'Delay',
      min: 1000,
      step: 1000,
      addonRight: {
        text: 'ms'
      }
    },
    expressionProperties: {
      'templateOptions.disabled': '!model.autoRefreshEnable'
    }
  }
];

/** Interface to manage fields on form */
export interface FormModel {
  from?: string;
  to?: string;
  interval?: {
    value: number,
    unity: string
  };
  operation?: any;
  autoRefreshEnable?: boolean;
  autoRefreshDelay?: number;
}
