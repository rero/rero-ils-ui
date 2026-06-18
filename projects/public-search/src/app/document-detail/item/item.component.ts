// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, effect, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AvailabilityComponent, NotesFilterPipe, SafeUrlPipe, AppStore } from '@rero/shared';
import { Nl2brPipe, RecordData } from '@rero/ng-core';
import { ItemApiService } from '../../api/item-api.service';
import { ItemRequestComponent } from './item-request.component';
import { PickupLocationComponent } from '../request/pickup-location/pickup-location.component';

@Component({
    selector: 'public-search-item',
    templateUrl: './item.component.html',
    imports: [TranslateDirective, AvailabilityComponent, Nl2brPipe, NotesFilterPipe, SafeUrlPipe, TranslatePipe, ItemRequestComponent, PickupLocationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {

  private translateService = inject(TranslateService);
  private appStore = inject(AppStore);
  public itemApiService = inject(ItemApiService);

  protected readonly isPatron = computed(() => this.appStore.user()?.isPatron ?? false);

  /** Item record */
  item = input<RecordData>();

  /** View code */
  viewcode = input<string>();

  /** context */
  context = input<string>();

  /** Temporary item type circulation */
  circulationInformation: string | undefined = undefined;

  /** Authorized types of note */
  noteAuthorizedTypes: string[] = [
    'binding_note',
    'condition_note',
    'general_note',
    'patrimonial_note',
    'provenance_note'
  ];

  showRequestDialog = false;

  constructor() {
    effect(() => {
      const item = this.item();
      if (item) {
        const { circulation_information } = (item.metadata as any).item_type;
        if (circulation_information) {
          const information = circulation_information.find((obj: any) => obj.language === this.translateService.getCurrentLang());
          if (information) {
            this.circulationInformation = information.label;
          }
        }
      }
    });
  }

  /** Current interface language */
  get language() {
    return this.translateService.getCurrentLang();
  }
}
