// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AddressType } from '../../classes/address-type';

@Component({
  selector: 'admin-address-type',
  templateUrl: './address-type.component.html',
  styleUrls: [],
  imports: [TranslatePipe],
})
export class AddressTypeComponent {
  addressType = input<AddressType>();
}
