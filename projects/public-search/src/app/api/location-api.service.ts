// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApi } from '@rero/shared';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationApiService extends BaseApi {

  private httpClient: HttpClient = inject(HttpClient);

  /**
   * Get pickup locations by viewcode
   * @param record pid - pid of item or holding
   * @param recordType - 'item' or 'holding'
   * @return Observable - locations pids and pickup_names for item or holding
   */
  getPickupLocationsByRecordId(recordType: string, recordPid: string) {
    return this.httpClient
      .get<any>(`/api/${recordType}/${recordPid}/pickup_locations`)
      .pipe(map(result => {
        const locations = [];
        if (result) {
          result.locations.forEach((location: any) => {
            locations.push({
              pid: location.pid,
              name: location.pickup_name || location.name
            });
          });
        }
        return locations;
      }));
  }
}
