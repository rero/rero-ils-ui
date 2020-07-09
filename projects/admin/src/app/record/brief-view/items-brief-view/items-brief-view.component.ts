import { Component, Input } from '@angular/core';
import { ResultItem } from '@rero/ng-core';

@Component({
  selector: 'admin-inventory-brief-view',
  templateUrl: './items-brief-view.component.html',
  styles: []
})
export class ItemsBriefViewComponent implements ResultItem {

  /**
   * Record
   */
  @Input()
  record: any;

  /**
   * Type of record
   */
  @Input()
  type: string;

  /**
   * Detail Url
   */
  @Input()
  detailUrl: { link: string, external: boolean };

}
