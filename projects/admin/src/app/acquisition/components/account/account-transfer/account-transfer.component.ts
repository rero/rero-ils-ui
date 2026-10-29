// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from '@openng/optimus-ui/api';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { InputGroupModule } from '@openng/optimus-ui/inputgroup';
import { InputGroupAddonModule } from '@openng/optimus-ui/inputgroupaddon';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';
import { SelectModule } from '@openng/optimus-ui/select';
import { CONFIG, GetRecordPipe, HttpPendingService } from '@rero/ng-core';
import { AppStore, Tools } from '@rero/shared';
import { filter, map, switchMap, take } from 'rxjs';

import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { IAcqAccount } from '../../../classes/account';
import { orderAccountsAsTree } from '../../../utils/account';

@Component({
  selector: 'admin-account-transfer',
  templateUrl: './account-transfer.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    Bind,
    Button,
    AsyncPipe,
    CurrencyPipe,
    GetRecordPipe,
    TranslatePipe,
    SelectModule,
    CardModule,
    RadioButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
  ],
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
        this.acqAccountApiService.getAccounts(pid, undefined, { sort: 'depth' }).pipe(map(orderAccountsAsTree)),
      ),
    ),
    { initialValue: [] as IAcqAccount[] },
  );

  readonly budgets = computed(() =>
    Array.from(new Set(this.accountsTree().map((a) => a.budget.pid)))
      .filter((pid): pid is string => pid !== undefined)
      .map((pid) => ({ code: pid })),
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
    effect(
      () => {
        const first = this.budgets()[0];
        if (first && !untracked(this.selectedBudget)) {
          this.selectedBudget.set(first);
        }
      },
      { allowSignalWrites: true },
    );

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
    if (this.httpPending.isPending()) {
      return;
    }
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
