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
import { Location } from '@angular/common';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationLogsService } from '@app/admin/service/operation-logs.service';
import { TranslateService } from '@ngx-translate/core';
import { DetailComponent, RecordService, RecordUiService } from '@rero/ng-core';
import { Entity } from '@rero/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'admin-local-page-detail',
  templateUrl: './local-page-detail.component.html'
})
export class LocalPageDetailComponent extends DetailComponent {

  /**
   * Is operation log enabled
   * @return boolean
   */
  get isEnabledOperationLog(): boolean {
    return this.operationLogsService.isLogVisible('local_entities');
  }

  /**
   * Constructor
   * @param route - ActivatedRoute
   * @param router - Router
   * @param location - Location
   * @param componentFactoryResolver - ComponentFactoryResolver
   * @param recordService - RecordService
   * @param recordUiService - RecordUiService
   * @param toastrService - ToastrService
   * @param translate - TranslateService
   * @param spinner - NgxSpinnerService
   * @param bsModalService - BsModalService
   * @param operationLogsService - OperationLogsService
   */
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected recordService: RecordService,
    protected recordUiService: RecordUiService,
    protected toastrService: ToastrService,
    protected translate: TranslateService,
    protected spinner: NgxSpinnerService,
    protected bsModalService: BsModalService,
    private operationLogsService: OperationLogsService,
  ) {
    super(route, router, location, componentFactoryResolver, recordService, recordUiService, toastrService, translate, spinner);
  }

  /**
   * Launch an expert search on the document view.
   * @param record - the record
   */
  search(record: any): void
  {
    this.router.navigate(
      ['/records', 'documents'],
      {
        queryParams: { q: Entity.generateSearchQuery(record.metadata.type, 'local', record.metadata.pid), simple: '0' },
        skipLocationChange: true
      },
    );
  }
}
