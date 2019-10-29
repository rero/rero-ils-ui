import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditorComponent, RecordUiService } from '@rero/ng-core';
import { FrameworkLibraryService } from 'angular6-json-schema-form';
import { RecordService } from '@rero/ng-core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { WidgetLibraryService } from 'angular6-json-schema-form';
import { Location } from '@angular/common';
import { CustomBootstrap4Framework } from '@rero/ng-core';
import { EditorService } from '../service/editor.service';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';


@Component({
  selector: 'admin-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.css']
})

/**
 * Show Document Editor with a specific input: EAN import.
 */
export class DocumentEditorComponent extends EditorComponent implements OnInit {

  /**
   * Constructor
   * @param bootstrap4framework CustomBootstrap4Framework
   * @param route ActivatedRoute
   * @param recordService RecordService
   * @param recordUiService RecordUiService
   * @param widgetLibrary WidgetLibraryService
   * @param translateService TranslateService
   * @param location Location
   * @param frameworkLibrary FrameworkLibraryService
   * @param editorService EditorService
   * @param toastService ToastrService
   */
  constructor(
    @Inject(CustomBootstrap4Framework) bootstrap4framework,
    protected route: ActivatedRoute,
    protected recordService: RecordService,
    protected recordUiService: RecordUiService,
    protected widgetLibrary: WidgetLibraryService,
    protected translateService: TranslateService,
    protected location: Location,
    protected toastrService: ToastrService,
    protected frameworkLibrary: FrameworkLibraryService,
    private editorService: EditorService,
  ) {
    super(
      bootstrap4framework, route, recordService, recordUiService,
      widgetLibrary, translateService, location, toastrService, frameworkLibrary);
  }

  /**
   * Retrieve information about an item regarding its EAN code using EditorService
   * @param ean EAN code
   */
  importFromEan(ean) {
    // EAN example: 9782070541270
    this.editorService.getRecordFromBNF(ean).subscribe(
      record => {
        if (record) {
          record.metadata.$schema = this.schemaForm.schema.properties.$schema.default;
          this.schemaForm.data = record.metadata;
        } else {
          this.toastrService.warning(
            _('EAN not found!'),
            _('Import')
          );
        }
      }
      );
  }

}
