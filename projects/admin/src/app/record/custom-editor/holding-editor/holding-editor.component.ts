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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { removeEmptyValues } from '@rero/ng-core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
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
export class HoldingEditorComponent implements OnInit, OnDestroy {

  /** Initial editor values */
  model = {};

  /** Current list of the serial preview examples */
  serialPreviewExamples: Array<PredictionIssue> = [];

  /** Number of the serial preview examples */
  numberOfSerialPreviewExamples = 100;

  /** Current error message from the backend during the serial preview example if exists */
  serialPreviewError = null;

  /**  */
  predictionModel$ = new BehaviorSubject({} as any);


  /** Observable subscription */
  private _subscription = new Subscription();

  /**
   * Constructor.
   * @param _editorService - the local editor service
   */
  constructor(private _editorService: EditorService) { }

  /** Component initialization. */
  ngOnInit() {
    this._subscription = this.predictionModel$.pipe(
      // wait .5s before the last change
      debounceTime(500),
      // only if the patterns changed
      distinctUntilChanged((a, b) => JSON.stringify(a.patterns) === JSON.stringify(b.patterns)),
      // cancel previous pending requests
      switchMap(modelValue => this._editorService.getHoldingPatternPreview(
        modelValue, this.numberOfSerialPreviewExamples).pipe(
          catchError((error) => {
            // if the syntax is not valid the server returns an 400 error
            // display the error and do not abort the connection with the
            // server
            if (error.status === 400) {
              this.serialPreviewError = error.error;
              return of(null);
            }
          })
        ))
    ).subscribe((predictions) => {
      if (predictions && predictions.length > 0) {
        this.serialPreviewExamples = predictions;
      }
    });
  }

  /** Component destruction. */
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  /**
   * Called when the editor values are changed.
   * It gets the serial prediction example.
   * @param modelValue - new editor value
   */
  modelChanged(modelValue) {
    modelValue = removeEmptyValues(modelValue);
    if (
      modelValue.patterns
      && modelValue.patterns.template
    ) {
      this.serialPreviewError = null;
      this.predictionModel$.next(modelValue);
    }
  }
}
