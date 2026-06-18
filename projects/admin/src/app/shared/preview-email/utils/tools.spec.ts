// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
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
