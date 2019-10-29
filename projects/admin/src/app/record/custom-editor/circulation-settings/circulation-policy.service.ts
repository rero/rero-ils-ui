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

import { Injectable } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CirculationPolicy } from './circulation-policy';
import { cleanDictKeys, RecordService } from '@rero/ng-core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CirculationPolicyService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recordService: RecordService,
    private toastService: ToastrService,
    private translateService: TranslateService
  ) { }

  loadOrCreateCirculationPolicy(pid: number = null) {
    if (pid) {
      return this.recordService.getRecord('circ_policies', '' + pid)
      .pipe(
        map(data => new CirculationPolicy(data.metadata))
      );
    } else {
      return of(new CirculationPolicy());
    }
  }

  loadAllItemTypesPatronTypesCirculationPolicies() {
    return forkJoin(
      this.recordService.getRecords('item_types', '', 1, RecordService.MAX_REST_RESULTS_SIZE),
      this.recordService.getRecords('patron_types', '', 1, RecordService.MAX_REST_RESULTS_SIZE),
      this.recordService.getRecords('circ_policies', '', 1, RecordService.MAX_REST_RESULTS_SIZE)
    );
  }

  save(circulationPolicy: CirculationPolicy) {
    circulationPolicy = cleanDictKeys(circulationPolicy);
    if (circulationPolicy.pid) {
      this.recordService
      .update('circ_policies', circulationPolicy)
      .subscribe(() => {
        this.toastService.success(
          this.translateService.instant('Record Updated!'),
          this.translateService.instant('circ_policies')
        );
        this.router.navigate(['../../detail', circulationPolicy.pid], {relativeTo: this.route});
      });
    } else {
      this.recordService
      .create('circ_policies', circulationPolicy)
      .subscribe((record) => {
        this.toastService.success(
          this.translateService.instant('Record created!'),
          this.translateService.instant('circ_policies')
        );
        this.router.navigate(['../detail', record.metadata.pid], {relativeTo: this.route});
      });
    }
  }

  redirect() {
    this.router.navigate(['/records/circ_policies']);
  }
}
