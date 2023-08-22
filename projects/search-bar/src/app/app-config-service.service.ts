import { Injectable } from '@angular/core';
import { CoreConfigService } from '@rero/ng-core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigServiceService extends CoreConfigService {

  /**
   * Constructor
   */
  constructor() {
    super();
    this.appVersion = environment.appVersion;
  }
}
