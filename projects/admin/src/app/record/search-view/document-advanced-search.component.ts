/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { DocumentAdvancedSearchFormComponent } from './document-advanced-search-form/document-advanced-search-form.component';

@Component({
  selector: 'admin-document-advanced-search',
  template: `
    @if (!simple) {
      <button type="button" class="btn btn-outline-primary" (click)="openModalBox()">
        {{ 'Build advanced query' | translate }}
        <i class="fa fa-search ml-1" aria-hidden="true"></i>
      </button>
    }
  `
})
export class DocumentAdvancedSearchComponent implements OnInit, OnDestroy {

  private dialogService: DialogService = inject(DialogService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  /** Simple search */
  simple: boolean = true;

  /** Query event */
  @Output() queryString = new EventEmitter<string>();

  /** all component subscription */
  private subscription = new Subscription();

  /** OnInit hook */
  ngOnInit(): void {
    this.subscription.add(this.route.queryParams.subscribe((params: any) => {
      if (params.simple) {
        if (Array.isArray(params.simple)) {
          this.simple =  params.simple.length > 0 ? ('1' === params.simple.pop()) : true;
        } else {
          this.simple = ('1' === params.simple);
        }
      } else {
        this.simple = true;
      }
    }));
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  /** Opening the advanced search dialog */
  openModalBox(): void {
    const ref: DynamicDialogRef = this.dialogService.open(DocumentAdvancedSearchFormComponent, {
      dismissableMask: true
    });
    this.subscription.add(
      ref.onClose.subscribe((queryString?: string) => {
        if (queryString) {
          this.queryString.emit(queryString);
        }
      })
    );
  }
}
