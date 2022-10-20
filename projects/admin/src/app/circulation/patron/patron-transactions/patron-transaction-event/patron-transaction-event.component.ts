import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { PatronTransactionEvent, PatronTransactionEventType } from '@app/admin/classes/patron-transaction';

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

  /**
   * Constructor
   * @param _organisationService - OrganisationService
   * @param _translateService - TranslateService
   */
  constructor(
    private _organisationService: OrganisationService,
    private _translateService: TranslateService
  ) { }

  /** Get current organisation
   *  @return: current organisation
   */
  get organisation() {
    return this._organisationService.organisation;
  }

  /**
   * Get the best possible label of the transaction event
   * @return label to display as string
   */
  get label(): string {
    return (this.event.subtype)
      ? `${this._translateService.instant(this.event.type.toString())} [${this._translateService.instant(this.event.subtype)}]`
      : this._translateService.instant(this.event.type.toString());
  }
}
