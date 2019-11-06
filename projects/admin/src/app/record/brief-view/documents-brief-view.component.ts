/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

import { Component, Input, OnInit } from '@angular/core';
import { ResultItem, RecordService } from '@rero/ng-core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../service/user.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'admin-documents-brief-view',
  template: `
  <h5 class="mb-0 card-title">{{ record.metadata.title }}
  <small> &ndash; {{ record.metadata.type | translate }}</small></h5>
  <div class="card-text">

    <!-- author -->
    <ul class="list-inline mb-0" *ngIf="record.metadata.authors && record.metadata.authors.length > 0">
      <li class="list-inline-item" *ngFor="let author of record.metadata.authors.slice(0,3); let last = last">
        <span *ngIf="!author.pid">
          {{ authorName(author) }}
          {{ author.qualifier ? author.qualifier : '' }}
          {{ author.date ? author.date : '' }}
        </span>
        <a *ngIf="author.pid" href="#">
          {{ authorName(author) }}
          {{ author.qualifier ? author.qualifier : '' }}
          {{ author.date ? author.date : '' }}
        </a>
        {{ last ? '' : '; ' }}

      </li>
      <li *ngIf="record.metadata.authors && record.metadata.authors.length > 3">; …</li>
    </ul>

    <!-- publisher_statements -->
    <span *ngIf="record.metadata.publisherStatement">
      {{ record.metadata.publisherStatement[0] }}
    </span>
  </div>
  <section *ngIf="!record.metadata.harvested">
    <button *ngIf="countHoldingsItems()"
       class="btn btn-link"
       (click)="toggleCollapse()"
       aria-expanded="false" aria-controls="itemsList">
      <i [ngClass]="{'fa-caret-down':!isItemsCollapsed, 'fa-caret-right': isItemsCollapsed}" class="fa" aria-hidden="true"></i>
      <span translate *ngIf="countHoldingsItems() == 1"> item</span>
      <span translate *ngIf="countHoldingsItems() > 1"> items</span>
    </button>
    <strong *ngIf="!countHoldingsItems()" translate>no item</strong>
    <a class="ml-2 text-secondary" routerLinkActive="active"
      [queryParams]="{document: record.metadata.pid}" [routerLink]="['/records/items/new']">
      <i class="fa fa-plus" aria-hidden="true"></i> {{ 'Add' | translate }}
    </a>
  </section>
  <ul *ngIf="countHoldingsItems() > 0 && !isItemsCollapsed"
      class="list-group list-group-flush"
      [collapse]="isItemsCollapsed">
    <li *ngFor="let item of groupItems" class="list-group-item p-1">
      <a [routerLink]="['/records/items/detail', item.metadata.pid]">
        {{item.metadata.barcode}}
      </a><span> ({{ item.metadata.status | translate }})</span>
      <a *ngIf="canDeleteItem(item)" (click)="deleteItem(item.metadata.pid)"
         class="float-right text-secondary btn p-1"
         [ngClass]="{'disabled': item.permissions.cannot_delete}" title="{{ 'Delete' | translate }}"
      >
        <i class="fa fa-trash" aria-hidden="true"></i>
      </a>
      <a *ngIf="canEditItem(item)" class="btn p-1 ml-2 float-right text-secondary"
         routerLinkActive="active"
         [routerLink]="['/records/items/edit', item.metadata.pid]"
         [queryParams]="{document: record.metadata.pid}"
         title="{{ 'Edit' | translate }}">
        <i class="fa fa-pencil" aria-hidden="true"></i>
      </a>
    </li>
  </ul>
  `,
  styles: []
})
export class DocumentsBriefViewComponent implements ResultItem, OnInit {

  @Input()
  record: any;

  @Input()
  type: string;

  @Input()
  detailUrl: { link: string, external: boolean };

  isItemsCollapsed = true;

  items = [];

  groupItems = [];

  constructor(
    private recordsService: RecordService,
    private translate: TranslateService,
    private toastService: ToastrService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.items = this.getItems();
  }

  publisherNames() {
    const indexName = `name_${this.translate.currentLang}`;
    const publishers = [];
    for (const publisher of this.record.metadata.publishers) {
      let lngName = publisher[indexName];
      if (!lngName) {
        lngName = publisher.name;
      }
      publishers.push(lngName);
    }
    return publishers;
  }

  authorName(author) {
    const indexName = `name_${this.translate.currentLang}`;
    let lngName = author[indexName];
    if (!lngName) {
      lngName = author.name;
    }
    return lngName;
  }

  deleteItem(pid) {
    this.recordsService.delete('items', pid).subscribe((success: any) => {
      if (success) {
        for (const holding of this.record.metadata.holdings) {
          holding.items = holding.items.filter(item => item.pid !== pid);
        }
        this.toastService.success(_('Record deleted'), _('documents'));
      }
    });
  }

  canDeleteItem(item) {
    if (item.links.delete) {
      return true;
    }
    return false;
  }

  canEditItem(item) {
    if (item.links.delete) {
      return true;
    }
    return false;
  }

  ownedHolding(holding) {
    // return true;
    const currentUser = this.userService.getCurrentUser();
    if ('system_librarian' in currentUser.roles) {
      return currentUser.library.organisation.pid === holding.organisation.organisation_pid;
    }
    return currentUser.library.pid === holding.organisation.library_pid;
  }

  getItems() {
    const items = [];
    if ('holdings' in this.record.metadata) {
      for (const holding of this.record.metadata.holdings) {
        if ('items' in holding && this.ownedHolding(holding)) {
          for (const item of holding.items) {
            items.push(item);
          }
        }
      }
    }
    return items;
  }

  toggleCollapse() {
    const observables = [];

    if (this.isItemsCollapsed) {
      this.groupItems = [];
      this.items.map(item => {
        observables.push(this.recordsService.getRecord('items', item.pid));
      });
      combineLatest(observables).subscribe((results: any) => {
        results.map(result =>
          this.groupItems.push(result)
        );
      });
    }
    this.isItemsCollapsed = !this.isItemsCollapsed;
  }

  countHoldingsItems() {
    return this.items.length;
  }
}
