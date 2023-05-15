/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "@rero/shared";
import { PrimengImportModule } from "../primeng-import/primeng-import.module";
import { PreviewEmailComponent } from "./component/preview-email/preview-email.component";

@NgModule({
  declarations: [
    PreviewEmailComponent
  ],
  imports: [
    FormsModule,
    PrimengImportModule,
    SharedModule,
    TranslateModule
  ],
  exports: [
    PreviewEmailComponent
  ]
})
export class PreviewEmailModule { }
