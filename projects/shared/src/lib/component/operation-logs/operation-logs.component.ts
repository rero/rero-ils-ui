// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { _, TranslatePipe } from "@ngx-translate/core";
import type { EsResult, RecordData } from '@rero/ng-core';
import { DateTranslatePipe, NgCoreTranslateService } from '@rero/ng-core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { OperationLogsApiService } from '../../api/operation-logs-api.service';
import { AppStore } from '../../store/app.store';

@Component({
    selector: 'shared-operation-logs',
    templateUrl: './operation-logs.component.html',
    imports: [Bind, TableModule, Button, DateTranslatePipe, TranslatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationLogsComponent {

  private dynamicDialogRef: DynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);
  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);
  private appStore: InstanceType<typeof AppStore> = inject(AppStore);
  private translateService: NgCoreTranslateService = inject(NgCoreTranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  private readonly resourceType: string = this.dynamicDialogConfig?.data?.resourceType;
  private readonly resourcePid: string = this.dynamicDialogConfig?.data?.resourcePid;
  private readonly resourceKey: string = this.appStore.getResourceKeyByResourceName(this.resourceType);

  /** items per pages */
  private readonly itemsPerPage = 5;
  /** Current page */
  private readonly page = signal(1);
  /** Total of records */
  readonly recordTotals = signal(0);
  /** Array of records */
  readonly records = signal<RecordData[]>([]);
  /** first loaded record */
  readonly loadedRecord = signal(false);

  // COMPUTED =================================================================
  /** Show more link is visible ? */
  readonly isLinkShowMore = computed(() =>
    this.recordTotals() > 0 && (this.page() * this.itemsPerPage) < this.recordTotals()
  );

  /** Hidden operation logs counter */
  readonly hiddenOperationLogs = computed(() => {
    let count = this.recordTotals() - (this.page() * this.itemsPerPage);
    count = Math.max(count, 0);
    const linkText = (count > 1)
      ? _('{{ counter }} hidden operation logs')
      : _('{{ counter }} hidden operation log');
    return this.translateService.instant(linkText, { counter: count });
  });

  constructor() {
    forkJoin([this.operationLogsQuery(1, 'create'), this.operationLogsQuery(1, 'update')])
      .pipe(
        finalize(() => this.loadedRecord.set(true))
      )
      .subscribe(([createOpLogs, updateOpLogs]) => {
        this.recordTotals.set(updateOpLogs.hits.total.value);
        this.records.update(r => [...r, ...createOpLogs.hits.hits, ...updateOpLogs.hits.hits]);
      });
  }

  /** Close operation log dialog */
  closeDialog(): void {
    this.dynamicDialogRef.close();
  }

  /** show more */
  showMore(): void {
    this.page.update(p => p + 1);
    this.operationLogsQuery(this.page(), 'update')
      .subscribe((response: EsResult) => this.records.update(r => [...r, ...response.hits.hits]));
  }

  /**
   * Operation logs query
   * @param page - number
   * @param action - string
   * @return Observable
   */
  private operationLogsQuery(page: number, action: 'create' | 'update'): Observable<EsResult> {
    return this.operationLogsApiService
      .getLogs(this.resourceKey, this.resourcePid, action, page, this.itemsPerPage) as Observable<EsResult>;
  }
}
