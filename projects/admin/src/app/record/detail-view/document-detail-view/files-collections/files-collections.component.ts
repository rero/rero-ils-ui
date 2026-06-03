/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourcesFilesService } from '@app/admin/service/resources-files.service';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Bind } from 'primeng/bind';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'admin-files-collections',
    templateUrl: './files-collections.component.html',
    imports: [TranslateDirective, FormsModule, ReactiveFormsModule, Bind, AutoComplete, Tooltip, PrimeTemplate, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesCollectionsComponent {

  private messageService = inject(MessageService);
  private resourcesFilesService = inject(ResourcesFilesService);
  private translateService = inject(TranslateService);
  private appStore = inject(AppStore);

  protected readonly currentParentRecord = this.resourcesFilesService.currentParentRecord;

  formGroup = new FormGroup({
    collections: new FormControl<string[] | null>(null)
  });

  constructor() {
    effect(() => {
      const rec = this.resourcesFilesService.currentParentRecord();
      if (rec?.metadata?.collections) {
        this.formGroup.get('collections')!.setValue(rec.metadata.collections, { emitEvent: false });
      } else {
        this.formGroup.get('collections')!.setValue(null, { emitEvent: false });
      }
    });

    this.formGroup.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(() => this.save());
  }

  getCollectionLink(name: string): string {
    const viewcode = this.appStore.organisation().code;
    return `/${viewcode}/search/documents?q=files.collections.raw:(${name})&simple=0`;
  }


  save(): void {
    const rec = this.resourcesFilesService.currentParentRecord();
    if (!rec) return;
    const coll = Array.from(new Set(this.formGroup.get('collections')!.value));
    const metadata = rec.metadata;
    if (coll) {
      metadata.collections = coll;
    } else {
      delete metadata.collections;
    }
    this.resourcesFilesService
      .updateParentRecordMetadata(rec.id, { metadata })
      .subscribe(updatedRecord => this.resourcesFilesService.currentParentRecord.set(updatedRecord));
    this.formGroup.markAsPristine();
    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant('File'),
      detail: this.translateService.instant('Collections have been saved successfully.'),
      life: CONFIG.MESSAGE_LIFE
    });
  }
}
