/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
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
import { Tools } from './tools';

describe('Tools', () => {
  it('should create an instance', () => {
    expect(new Tools()).toBeTruthy();
  });

  it('Should process suggestions', () => {
    const recipientSuggestions = [
      { address: 'foo@gmail.com' },
      { address: 'bar@gmail.com', type: ['reply_to', 'cc'] },
      { address: 'vendor1@gmail.com', type: ['to'] },
      { address: 'vendor2@gmail.com', type: ['to'] },
    ];

    const output = {
      emails: ['bar@gmail.com', 'foo@gmail.com', 'vendor1@gmail.com', 'vendor2@gmail.com'],
      recipients: [
        { address: 'bar@gmail.com', type: 'reply_to' },
        { address: 'bar@gmail.com', type: 'cc' },
        { address: 'vendor1@gmail.com', type: 'to' },
        { address: 'vendor2@gmail.com', type: 'to' }
      ]
    }
    expect(Tools.processRecipientSuggestions(recipientSuggestions)).toEqual(output);
  });
});
