/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

import { TestBed } from "@angular/core/testing";
import { ProvisionActivityPipe, ProvisionActivityType } from "./provision-activity.pipe";

describe('ProvisionActivityPipe', () => {
  let pipe: ProvisionActivityPipe;

  const provisionActivities = {
    provisionActivity: [
      {
        type: ProvisionActivityType.PUBLICATION,
        _text: [
          { value: 'Provision activity Publication'}
        ]
      },
      {
        type: ProvisionActivityType.MANUFACTURE,
        _text: [
          { value: 'Provision activity Manufacture'}
        ]
      },
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProvisionActivityPipe
      ]
    });
    pipe = TestBed.inject(ProvisionActivityPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null if we have no provision activity', () => {
    expect(pipe.transform({})).toBeNull();
  });

  it('should return the value of provision activity with selection by type', () => {
    expect(pipe.transform(provisionActivities)).toEqual('Provision activity Publication');
    expect(pipe.transform(
      provisionActivities,
      ProvisionActivityType.MANUFACTURE)
    ).toEqual('Provision activity Manufacture');
  });

  it('should return the value of enum', () => {
    expect(ProvisionActivityType.DISTRIBUTION).toEqual('bf:Distribution');
    expect(ProvisionActivityType.MANUFACTURE).toEqual('bf:Manufacture');
    expect(ProvisionActivityType.PRODUCTION).toEqual('bf:Production');
    expect(ProvisionActivityType.PUBLICATION).toEqual('bf:Publication');
  });
});
