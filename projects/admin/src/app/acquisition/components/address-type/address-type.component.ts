// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input, ChangeDetectionStrategy} from '@angular/core';
import { AddressType } from '../../classes/address-type';
import { TranslateDirective } from '@ngx-translate/core';


@Component({
    selector: 'admin-address-type',
    templateUrl: './address-type.component.html',
    styleUrls: [],
    imports: [TranslateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressTypeComponent {

  addressType = input<AddressType>();

}
