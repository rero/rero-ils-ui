import { Component } from '@angular/core';
import { EditorService } from '../../../service/editor.service';
import { removeEmptyValues } from '@rero/ng-core';

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
  serialPreviewExamples = [];

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
        response => {
          if (response && response.issues && response.issues.length > 0) {
            this.serialPreviewExamples = response.issues;
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
