/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
 * Copyright (C) 2019-2022 UCLouvain
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
import { Component, ViewChild } from '@angular/core';
import { RecordSearchComponent, RecordSearchPageComponent, SearchResult } from '@rero/ng-core';
import { PaymentData } from './interfaces';

@Component({
  selector: 'admin-patron-transaction-event-search-view',
  templateUrl: './patron-transaction-event-search-view.component.html',
})
export class PatronTransactionEventSearchViewComponent extends RecordSearchPageComponent {

  @ViewChild('recordSearch') myElt: RecordSearchComponent = null;

  /** The data relative to payments transaction events */
  paymentData: PaymentData = {
    total: 0,
    subtypes: []
  };

  /** The search result from search engine */
  private _searchResult: SearchResult;
  /** Resource type */
  private _resourceType = 'patron_transaction_events';

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Result of search with type and records (Elasticsearch)
   * @param event - SearchResult
   */
  recordsSearched(event: SearchResult) {
    if (event && event.type === this._resourceType) {
      this._searchResult = event;
      const totalAgg = this._getAggregation('total');
      if (totalAgg) {
        this.paymentData = {total: 0, subtypes: []};  // re-init the payment data.
        this._extractPaymentInformation(totalAgg);
      }
    }
  }

  // PRIVATE COMPONENT FUNCTIONS ==============================================
  /**
   * Get an aggregation from search result based on aggregation name.
   * @param aggName - string: the aggregation name
   * @return: the corresponding aggregation data or `null` if aggregation doesn't exist.
   */
  private _getAggregation(aggName: string): any | null {
    if (this._searchResult && this._searchResult.records && this._searchResult.records.aggregations) {
      const aggregationNames = Object.keys(this._searchResult.records.aggregations);
      if (aggregationNames.includes(aggName)) {
        return this._searchResult.records.aggregations[aggName];
      }
    }
  }

  /**
   * Extract data from 'total payment' aggregation to set `paymentData` variable.
   * @param agg: the search engine aggregation data.
   */
  private _extractPaymentInformation(agg: any): void {
    if (!agg.payment || !agg.payment.value || agg.payment?.value <= 0) {
      return;
    }
    this.paymentData.total = agg.payment.value;
    agg?.subtype.buckets.map(subtype => {
      this.paymentData.subtypes.push({name: subtype.key, total: subtype.subtotal.value});
    });
  }

}
