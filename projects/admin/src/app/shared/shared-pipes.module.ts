/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { NgModule } from '@angular/core';
import { AuthorNameTranslatePipe } from '../pipe/author-name-translate.pipe';
import { MainTitlePipe } from '../pipe/main-title.pipe';
import { ProvisionActivityPipe } from '../pipe/provision-activity.pipe';

@NgModule({
  declarations: [
    AuthorNameTranslatePipe,
    MainTitlePipe,
    ProvisionActivityPipe
  ],
  exports: [
    AuthorNameTranslatePipe,
    MainTitlePipe,
    ProvisionActivityPipe
  ]
})
export class SharedPipesModule {}
