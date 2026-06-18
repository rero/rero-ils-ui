// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Observable } from "rxjs";
import { IAvailability } from "../interface/i-availability";

export abstract class IAvailabilityService {
  /**
   * Get Availability of resource
   * @param pid - Resource pid
   * @param viewcode = The current view code
   * @returns an Observable of Availability data
   */
  abstract getAvailability(pid: string, viewcode?: string):  Observable<IAvailability>;
}
