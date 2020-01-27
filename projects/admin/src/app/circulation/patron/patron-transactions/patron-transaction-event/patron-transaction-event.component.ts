import { Component, Input } from '@angular/core';
import { PatronTransactionEvent, PatronTransactionEventType } from '../../../patron-transaction';
import { OrganisationService } from '../../../../service/organisation.service';

@Component({
  selector: 'admin-patron-transaction-event',
  templateUrl: './patron-transaction-event.component.html'
})
export class PatronTransactionEventComponent {

  /** the event ot display */
  @Input() event: PatronTransactionEvent;

  /** is the transaction event is collapsed */
  isCollapsed = true;

  /** store a reference to enum to use in html template */
  patronTransactionEventType = PatronTransactionEventType;

  constructor(private _organisationService: OrganisationService) { }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }

}
