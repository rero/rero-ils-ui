// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class BaseRoute {

  protected translateService: TranslateService = inject(TranslateService);
}
