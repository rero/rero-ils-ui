/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, computed, effect, inject, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ItemsService } from '@app/admin/service/items.service';
import { LoanService } from '@app/admin/service/loan.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { ConfirmationService } from 'primeng/api';
import { SelectChangeEvent, Select } from 'primeng/select';
import { map, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tooltip } from 'primeng/tooltip';
import { AsyncPipe } from '@angular/common';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-item-transaction',
    templateUrl: './item-transaction.component.html',
    providers: [ConfirmationService],
    imports: [RouterLink, Bind, Select, FormsModule, Button, ConfirmDialog, Tooltip, AsyncPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemTransactionComponent {

  private appStore = inject(AppStore);
  private itemService: ItemsService = inject(ItemsService);
  private loanService: LoanService = inject(LoanService);
  private confirmationService = inject(ConfirmationService);
  private translateService = inject(TranslateService);

  readonly transaction = input<any>();
  readonly type = input<string>();
  readonly background = input<boolean>();
  readonly itemPid = input<string>();
  readonly cancelRequestEvent = output<any>();
  readonly updatePickupLocationEvent = output<any>();

  private readonly _authorizedTypes = ['loan_request'];

  private readonly _fetchedLocations = toSignal(
    toObservable(this.type).pipe(
      switchMap(type => {
        if (!type || !this._authorizedTypes.includes(type)) return of(null);
        const currentLibrary = this.appStore.currentLibraryPid();
        return this.itemService.getPickupLocations(this.itemPid()).pipe(
          map(locations => ((locations as any[]) ?? []).map((loc: any) => ({
            label: loc.pickup_name || loc.name,
            value: loc.pid,
            _isDefault: loc.library.pid === currentLibrary
          })))
        );
      })
    ),
    { initialValue: null }
  );

  readonly pickupLocations = computed(() => this._fetchedLocations() ?? []);
  readonly currentPickupLocation = signal<{value: string, label: string} | null>(null);

  constructor() {
    effect(() => {
      const locs = this._fetchedLocations();
      if (locs) {
        const pid = this.transaction()?.metadata?.pickup_location_pid;
        this.currentPickupLocation.set(locs.find(loc => loc.value === pid) ?? null);
      }
    });
  }

  canCancelRequest(): boolean {
    return this.loanService.canCancelRequest(this.transaction());
  }

  canUpdateRequestPickupLocation(): boolean {
    return this.loanService.canUpdateRequestPickupLocation(this.transaction());
  }

  showCancelRequestDialog(): void {
    this.confirmationService.confirm({
      header: this.translateService.instant('Cancel request'),
      message: this.translateService.instant('Do you really want to cancel the request?'),
      acceptLabel: this.translateService.instant('Yes'),
      rejectLabel: this.translateService.instant('No'),
      icon: 'fa fa-exclamation-triangle fa-2x core:text-red-500',
      acceptButtonStyleClass: 'core:bg-red-500 core:border-red-500',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.emitCancelRequest(),
    });
  }

  emitCancelRequest(): void {
    this.cancelRequestEvent.emit(this.transaction());
  }

  emitUpdatePickupLocation(event: SelectChangeEvent): void {
    this.updatePickupLocationEvent.emit({
      pickupLocationPid: event.value.value,
      transaction: this.transaction()
    });
  }
}
