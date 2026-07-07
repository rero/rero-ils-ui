// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { AbstractCanDeactivateComponent, removeEmptyValues, EditorComponent } from '@rero/ng-core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EditorService } from '../../../service/editor.service';
import { PredictionIssue } from '../../../service/holdings.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { SlicePipe } from '@angular/common';

/**
 * Holding specific editor.
 * Adds prediction preview examples to the standard editor.
 */
@Component({
    selector: 'admin-holding-editor',
    templateUrl: './holding-editor.component.html',
    imports: [EditorComponent, TranslateDirective, SlicePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingEditorComponent extends AbstractCanDeactivateComponent implements OnInit, OnDestroy {

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private editorService: EditorService = inject(EditorService);

  /** Can deactivate from editor component */
  canDeactivate = false;

  /** Initial editor values */
  model = {};

  /** Current list of the serial preview examples */
  serialPreviewExamples: PredictionIssue[] = [];

  /** Store serial patterns template from model */
  serialPatternsTemplate = null;

  /** Number of the serial preview examples */
  numberOfSerialPreviewExamples = 100;

  /** Current error message from the backend during the serial preview example if exists */
  serialPreviewError = null;

  /**  */
  predictionModel$ = new BehaviorSubject({} as any);


  /** Observable subscription */
  private subscription = new Subscription();

  /** Component initialization. */
  ngOnInit() {
    this.subscription = this.predictionModel$.pipe(
      // wait .5s before the last change
      debounceTime(500),
      // only if the patterns changed
      distinctUntilChanged((a, b) => JSON.stringify(a.patterns) === JSON.stringify(b.patterns)),
      // cancel previous pending requests
      switchMap(modelValue => this.editorService.getHoldingPatternPreview(
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
      this.cdr.markForCheck();
    });
  }

  /** Component destruction. */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Called when the editor values are changed.
   * It gets the serial prediction example.
   * @param modelValue - new editor value
   */
  modelChanged(modelValue) {
    modelValue = removeEmptyValues(modelValue);
    if (modelValue.patterns && modelValue.patterns.template) {
      this.serialPatternsTemplate = modelValue.patterns.template;
      this.serialPreviewError = null;
      this.serialPreviewExamples = [];
      this.predictionModel$.next(modelValue);
    } else {
      this.serialPreviewExamples = [];
      this.serialPatternsTemplate = null;
    }
  }

  /**
   * Can deactivate changed on editor
   * @param activate - boolean
   */
  canDeactivateChanged(activate: boolean): void {
    this.canDeactivate = activate;
  }
}
