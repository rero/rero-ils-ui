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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { ResourcesFilesService } from '@app/admin/service/resources-files.service';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG } from '@rero/ng-core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'admin-files-collections',
    templateUrl: './files-collections.component.html',
    standalone: false
})
export class FilesCollectionsComponent implements OnInit, OnDestroy {

  private messageService: MessageService = inject(MessageService);
  private resourcesFilesService: ResourcesFilesService = inject(ResourcesFilesService);
  private translateService: TranslateService = inject(TranslateService);
  private organisationService: OrganisationService = inject(OrganisationService);

  // current record
  record: any;

  // form control for the collection editor
  formGroup = new FormGroup({
    collections: new FormControl<string[] | null>(null)
  });

  // all component subscription
  private subscriptions = new Subscription();

  /** OnInit hook */
  ngOnInit(): void {
      this.resourcesFilesService.currentParentRecord$.subscribe((record) => {
        this.setRecord(record, false);
      })
    this.subscriptions.add(
      this.formGroup.valueChanges.subscribe(() => this.save())
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Set the current file record.
   *
   * @param record - the file record instance.
   */
  setRecord(record, emitEvent=false): void {
    this.record = record;
    if (this.record?.metadata?.collections) {
      this.formGroup.get('collections').setValue(this.record.metadata.collections, {emitEvent});
    } else {
      this.formGroup.get('collections').setValue(null, {emitEvent});
    }
  }

  /**
   * Generate the public interface collection search link.
   *
   * @param name - the collection name
   * @returns - url on the public interface
   */
  getCollectionLink(name): string {
    const viewcode = this.organisationService.organisation.code;
    return `/${viewcode}/search/documents?q=files.collections.raw:(${name})&simple=0`;
  }

  /** Is the submit action is disabled? */
  disabled(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.formGroup.touched;
  }

  /**
   * Save the form and put the new value on the backend.
   */
  save(): void {
    const coll = this.formGroup.get('collections').value;
    const metadata = this.record.metadata;
    if (coll) {
      metadata.collections = coll;
    } else {
      delete metadata.collections;
    }
    this.resourcesFilesService
      .updateParentRecordMetadata(this.record.id, { metadata: metadata })
      .subscribe((record) => this.setRecord(record));
    this.formGroup.markAsPristine();
    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant('File'),
      detail: this.translateService.instant('Collections have been saved successfully.'),
      life: CONFIG.MESSAGE_LIFE
    });
  }
}
