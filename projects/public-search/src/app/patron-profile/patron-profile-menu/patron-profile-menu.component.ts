// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IMenu, PatronProfileStore } from '../store/patron-profile.store';

@Component({
    selector: 'public-search-patron-profile-menu',
    templateUrl: './patron-profile-menu.component.html',
    imports: [FormsModule, SelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileMenuComponent {

  protected store = inject(PatronProfileStore);

  patronPid = input.required<string>();

  selectedOrganisation = computed<IMenu | undefined>(() =>
    this.store.menu().find(menu => menu.value === this.patronPid())
  );
}
