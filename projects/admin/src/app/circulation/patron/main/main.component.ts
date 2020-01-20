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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../class/user';
import { PatronService } from '../../../service/patron.service';

@Component({
  selector: 'admin-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, OnDestroy {

  patron$: Observable<User>;

  constructor(private route: ActivatedRoute, private router: Router, private patronService: PatronService) { }

  ngOnInit() {
    const barcode = this.route.snapshot.paramMap.get('barcode');
    this.patron$ = this.patronService.getPatron(barcode);
  }

  clearPatron() {
    this.patronService.clearPatron();
    this.router.navigate(['/circulation']);
  }

  ngOnDestroy() {
    this.patronService.clearPatron();
  }
}
