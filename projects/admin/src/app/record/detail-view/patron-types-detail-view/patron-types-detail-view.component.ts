import { Component } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { OrganisationService } from '../../../service/organisation.service';

@Component({
  selector: 'admin-patron-types-detail-view',
  styleUrls: ['./patron-types-detail-view.component.scss'],
  templateUrl: './patron-types-detail-view.component.html'
})
export class PatronTypesDetailViewComponent implements DetailRecord {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** Constructor
   * @param _organisationService: OrganisationService
   */
  constructor(private _organisationService: OrganisationService) { }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }

}
