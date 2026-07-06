// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { _, TranslatePipe } from "@ngx-translate/core";
import type { EsResult, RecordData } from '@rero/ng-core';
import { DateTranslatePipe } from '@rero/ng-core';
import { Bind } from 'primeng/bind';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { Pager } from '../paginator/model/paginator-model';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AppStore } from '../../store/app.store';

export type sortOptionType = {
  value: string;
  label: string;
  icon: string;
};

@Component({
    selector: 'shared-operation-logs',
    templateUrl: './operation-logs.component.html',
    imports: [Bind, FormsModule, SelectModule, TableModule, DateTranslatePipe, TranslatePipe, PaginatorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationLogsComponent implements OnInit {

  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);
  private appStore: InstanceType<typeof AppStore> = inject(AppStore);
  private injector: Injector = inject(Injector);

  // COMPONENT ATTRIBUTES =====================================================
  private readonly resourceType: string = this.dynamicDialogConfig?.data?.resourceType;
  private readonly resourcePid: string = this.dynamicDialogConfig?.data?.resourcePid;
  private readonly resourceKey: string = this.appStore.getResourceKeyByResourceName(this.resourceType);

  /** Paginator configuration */
  readonly pager = signal<Pager>({
    page: 1,
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 20, 50]
  });
  /** Sort criteria */
  readonly sortCriteria = signal('mostrecent');
  /** Sort options */
  readonly sortOptions = signal([
    { value: 'mostrecent', label: _('Date (newest)'), icon: 'fa fa-sort-amount-desc' },
    { value: 'created', label: _('Date (oldest)'), icon: 'fa fa-sort-amount-asc' }
  ]);

  readonly operationLogsResult = signal<EsResult | undefined>(undefined);

  /** Total of records */
  readonly recordTotals = computed(() => this.operationLogsResult()?.hits.total.value ?? 0);
  /** Array of records */
  readonly records = computed<RecordData[]>(() => this.operationLogsResult()?.hits.hits ?? []);

  /** onInit hook */
  ngOnInit(): void {
    if (this.dynamicDialogConfig?.data?.sortCriteria) {
      this.sortCriteria.set(this.dynamicDialogConfig?.data?.sortCriteria);
    }
    if (this.dynamicDialogConfig?.data?.sortOptions) {
      this.sortOptions.set(this.dynamicDialogConfig?.data?.sortOptions);
    }
    effect(
      (onCleanup) => {
        const pager = this.pager();
        const sort = this.sortCriteria();

        const subscription = this.operationLogsApiService.getLogs(
          this.resourceKey,
          this.resourcePid,
          pager.page,
          pager.rows,
          sort
        )
          .subscribe(response => this.operationLogsResult.set(response as EsResult));

        onCleanup(() => subscription.unsubscribe());
      },
      { injector: this.injector }
    );
  }

  /** Close operation log dialog */
  closeDialog(): void {
    this.dynamicDialogRef.close();
  }

  /** Change page */
  pageChange(event: PaginatorState): void {
    const rows = event.rows || this.pager().rows;
    const hasRowsChanged = rows !== this.pager().rows;
    this.pager.update(pager => ({
      page: hasRowsChanged ? 1 : (event.page || 0) + 1,
      first: hasRowsChanged ? 1 : (event.first || 0) + 1,
      rows,
      rowsPerPageOptions: pager.rowsPerPageOptions
    }));
  }

  /** Change sort */
  sortChange(event: SelectChangeEvent): void {
    this.sortCriteria.set(event.value);
    this.pager.update(pager => ({ ...pager, page: 1, first: 1 }));
  }
}
