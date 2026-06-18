// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
