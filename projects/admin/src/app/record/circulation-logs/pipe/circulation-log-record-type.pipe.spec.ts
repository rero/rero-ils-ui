// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { CirculationLogRecordTypePipe } from './circulation-log-record-type.pipe';

describe('RecordTypePipe', () => {
  it('create an instance', () => {
    const pipe = new CirculationLogRecordTypePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the name of the record type', () => {
    const pipe = new CirculationLogRecordTypePipe();
    expect(pipe.transform('notif')).toEqual('notification');
    expect(pipe.transform('circ')).toEqual('circulation');
    expect(pipe.transform('foo')).toEqual('circulation');
  });
});
