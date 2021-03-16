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

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, cleanDictKeys, RecordService, UniqueValidator } from '@rero/ng-core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@rero/shared';
import { Library } from '../../../classes/library';
import { LibraryFormService } from './library-form.service';

@Component({
  selector: 'admin-libraries-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  public library: Library;
  public libForm: FormGroup;
  public organisationPid;

  constructor(
    private recordService: RecordService,
    private libraryForm: LibraryFormService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiService: ApiService,
    private toastService: ToastrService,
    private translateService: TranslateService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.params.subscribe( (params) => {
      const loggedUser = this.userService.user;
      if (loggedUser) {
        this.organisationPid = loggedUser.currentOrganisation;
      }
      if (params && params.pid) {
        this.recordService.getRecord('libraries', params.pid, 1).subscribe(record => {
          this.library = new Library(record.metadata);
          this.libraryForm.populate(record.metadata);
          this.libForm = this.libraryForm.form;
          this.setAsyncValidator();
        });
      } else {
        this.libraryForm.reset();
        this.library = new Library({});
        this.libForm = this.libraryForm.form;
        this.setAsyncValidator();
      }
    });
  }

  setAsyncValidator() {
    this.libForm.controls.code.setAsyncValidators([
      UniqueValidator.createValidator(
        this.recordService,
        'libraries',
        'code',
        this.library.pid
      )
    ]);
  }

  get name() { return this.libraryForm.name; }
  get address() { return this.libraryForm.address; }
  get email() { return this.libraryForm.email; }
  get code() { return this.libraryForm.code; }
  get openingHours() { return this.libraryForm.opening_hours as FormArray; }

  onSubmit() {
    this._cleanFormValues(this.libraryForm.getValues());
    this.library.update(this.libraryForm.getValues());
    if (this.library.pid) {
      this.recordService.update('libraries', this.library.pid, cleanDictKeys(this.library)).subscribe(record => {
        this.toastService.success(
          this.translateService.instant('Record Updated!'),
          this.translateService.instant('libraries')
        );
        this.router.navigate(['../../detail', this.library.pid], {relativeTo: this.route, replaceUrl: true});
      });
    } else {
      const organisation = {
        $ref: this.apiService.getRefEndpoint('organisations', this.organisationPid)
      };
      this.library.organisation = organisation;
      this.recordService.create('libraries', cleanDictKeys(this.library)).subscribe(record => {
        this.toastService.success(
          this.translateService.instant('Record created!'),
          this.translateService.instant('libraries')
        );
        this.router.navigate(['../detail', record.metadata.pid], {relativeTo: this.route, replaceUrl: true});
      });
    }
    this.libraryForm.reset();
  }

  /**
   * Clean form values before saving the library
   * @param formValues: the form values to clean
   */
  private _cleanFormValues(formValues: any): void {
    // CLEAN OPENING HOURS : When day is defined as closed, remove all periods/times
    formValues.opening_hours.forEach(day => {
      if (!day.is_open) {
        day.times = [];
      }
    });
  }

  onCancel(event) {
    event.preventDefault();
    this.location.back();
    this.libraryForm.reset();
  }
  addTime(dayIndex): void {
    this.libraryForm.addTime(dayIndex);
  }

  deleteTime(dayIndex, timeIndex): void {
    this.libraryForm.deleteTime(dayIndex, timeIndex);
  }
}
