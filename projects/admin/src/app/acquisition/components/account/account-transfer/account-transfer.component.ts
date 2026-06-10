/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
 * Copyright (C) 2021 UCLouvain
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

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { CONFIG, GetRecordPipe, HttpPendingService } from '@rero/ng-core';
import { AppStore, Tools } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { filter, map, switchMap, take } from 'rxjs';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { IAcqAccount } from '../../../classes/account';
import { orderAccountsAsTree } from '../../../utils/account';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'admin-account-transfer',
  templateUrl: './account-transfer.component.html',
  imports: [
    TranslateDirective, FormsModule, ReactiveFormsModule, RouterLink,
    Bind, Button, AsyncPipe, CurrencyPipe, GetRecordPipe, TranslatePipe,
    SelectModule, CardModule, RadioButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountTransferComponent {
  private acqAccountApiService = inject(AcqAccountApiService);
  private formBuilder = inject(UntypedFormBuilder);
  private translateService = inject(TranslateService);
  private router = inject(Router);
  private appStore = inject(AppStore);
  private messageService = inject(MessageService);
  readonly httpPending = inject(HttpPendingService);

  protected readonly organisation = this.appStore.organisation;

  // COMPONENT ATTRIBUTES =======================================================
  protected readonly form: UntypedFormGroup = this.formBuilder.group({
    source: [undefined, Validators.required],
    target: [undefined, Validators.required],
    amount: [0, Validators.min(0.01)],
  });

  private readonly accountsTree = toSignal(
    toObservable(this.appStore.currentLibraryPid).pipe(
      filter((pid): pid is string => !!pid),
      take(1),
      switchMap((pid) =>
        this.acqAccountApiService
          .getAccounts(pid, undefined, { sort: 'depth' })
          .pipe(map(orderAccountsAsTree))
      )
    ),
    { initialValue: [] as IAcqAccount[] }
  );

  readonly budgets = computed(() =>
    Array.from(new Set(this.accountsTree().map((a) => a.budget.pid)))
      .filter((pid): pid is string => pid !== undefined)
      .map((pid) => ({ code: pid }))
  );

  readonly selectedBudget = signal<{ code: string } | undefined>(undefined);

  readonly accountsToDisplay = computed(() => {
    const budget = this.selectedBudget();
    if (!budget) return [];
    return this.accountsTree().filter((acc) => acc.budget.pid === budget.code);
  });

  private readonly sourceValue = toSignal(this.form.controls['source'].valueChanges);

  // EFFECTS ====================================================================
  constructor() {
    /** Auto-select the first budget once accounts are loaded */
    effect(() => {
      const first = this.budgets()[0];
      if (first && !untracked(this.selectedBudget)) {
        this.selectedBudget.set(first);
      }
    }, { allowSignalWrites: true });

    /** Update amount validators when the source account changes */
    effect(() => {
      const source: IAcqAccount | undefined = this.sourceValue();
      if (source) {
        const max = source.remaining_balance?.self ?? 0;
        this.form.controls['amount'].setValidators([Validators.min(0.01), Validators.max(max)]);
        this.form.controls['amount'].updateValueAndValidity();
      }
    });
  }

  // GETTER & SETTER ============================================================
  get currencySymbol(): string {
    const org = this.organisation();
    if (!org) return '';
    return Tools.currencySymbol(this.translateService.getCurrentLang(), org.default_currency);
  }

  // PUBLIC FUNCTIONS ===========================================================
  /** Submit the form */
  submit(): void {
    if (this.httpPending.isPending()) { return; }
    this.acqAccountApiService
      .transferFunds(this.form.value.source.pid, this.form.value.target.pid, this.form.value.amount)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Account'),
            detail: this.translateService.instant('Fund transfer successful!'),
            life: CONFIG.MESSAGE_LIFE,
          });
          this.router.navigate(['/', 'acquisition', 'accounts']);
        },
        error: (err) =>
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Account'),
            detail: this.translateService.instant(err.error.message),
            sticky: true,
            closable: true,
          }),
      });
  }

  /**
   * Check an input form field to know if it's valid
   * @param fieldName - the field name to check
   */
  checkInput(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    if (!control) return true;
    return control.invalid && !!control.errors && (control.dirty || control.touched);
  }
}
