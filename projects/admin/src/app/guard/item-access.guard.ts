/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class ItemAccessGuard implements CanActivate {

  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private recordService: RecordService = inject(RecordService);
  private translateService: TranslateService = inject(TranslateService);
  private messageService: MessageService = inject(MessageService);

  /**
   * Item Access control
   * @param next - ActivatedRouteSnapshot
   * @param state - RouterStateSnapshot
   * @return boolean
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const itemPid = next.params.pid;
      this.recordService.getRecord('items', itemPid).pipe(
        map((data: any) => data.metadata),
        map(data => extractIdOnRef(data.holding.$ref))
      )
      .subscribe({
        next: (holdingPid) => {
        const query = `pid:${holdingPid}`;
        this.recordService.getRecords('holdings', query, 1, 1).pipe(
          map((result: Record) => this.recordService.totalHits(result.hits.total) === 0
            ? null
            : result.hits.hits[0]
          ),
        ).subscribe(data => {
          if (null === data) {
            this.messageService.add({
              severity: 'warn',
              summary: this.translateService.instant('item'),
              detail: this.translateService.instant('Access denied')
            });
            // Redirect to homepage
            this.router.navigate(['/']);
          }
          const userCurrentLibrary = this.userService.user.currentLibrary;
          if (userCurrentLibrary !== data.metadata.library.pid) {
            this.messageService.add({
              severity: 'warn',
              summary: this.translateService.instant('item'),
              detail: this.translateService.instant('Access denied')
            });
            // Redirect to homepage
            this.router.navigate(['/']);
          }
        });
      },
        error: () => {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('item'),
            detail: this.translateService.instant('Item not found')
          });
          // Redirect to homepage on error
          this.router.navigate(['/']);
        }
      });

      return true;
  }
}
