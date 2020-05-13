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

import { Component } from '@angular/core';
import { removeEmptyValues } from '@rero/ng-core';
import { EditorService } from '../../../service/editor.service';
import { PredictionIssue } from '../../../service/holdings.service';

/**
 * Holding specific editor.
 * Adds prediction preview examples to the standard editor.
 */
@Component({
  selector: 'admin-holding-editor',
  templateUrl: './holding-editor.component.html',
  styleUrls: ['./holding-editor.component.scss']
})
export class HoldingEditorComponent {

  /** Initial editor values */
  model = {};

  /** Current list of the serial preview examples */
  serialPreviewExamples: Array<PredictionIssue> = [];

  /** Number of the serial preview examples */
  numberOfSerialPreviewExamples = 100;

  /** Current error message from the backend during the serial preview example if exists */
  serialPreviewError = null;

  /**
   * Constructor.
   * @param _editorService - the local editor service
   */
  constructor(private _editorService: EditorService) { }

  /**
   * Called when the editor values are changed.
   * It gets the serial prediction example.
   * @param modelValue - new editor value
   */
  modelChanged(modelValue) {
    modelValue = removeEmptyValues(modelValue);
    this.serialPreviewExamples = [];
    this.serialPreviewError = null;
    if (modelValue.patterns && modelValue.patterns.template) {
      this._editorService.getHoldingPatternPreview(modelValue, this.numberOfSerialPreviewExamples).subscribe(
        (predictions) => {
          if (predictions && predictions.length > 0) {
            this.serialPreviewExamples = predictions;
          }
        },
        (error: any) => {
          if (error.error) {
            this.serialPreviewError = error.error;
          }
        }
      );
    }
  }
}
