// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';

import { PatronProfileFeeEventComponent } from './patron-profile-fee-event/patron-profile-fee-event.component';

@Component({
  selector: 'public-search-patron-profile-fee-events',
  templateUrl: './patron-profile-fee-events.component.html',
  imports: [PatronProfileFeeEventComponent],
})
export class PatronProfileFeeEventsComponent {
  events = input<any[]>();
}
