// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'circulationLogRecordType' })
export class CirculationLogRecordTypePipe implements PipeTransform {

  transform(recordType: string): unknown {
    switch(recordType) {
      case 'notif':
        return 'notification';
      case 'scan_item':
        return 'scan';
      default:
        return 'circulation';
    }
  }
}
