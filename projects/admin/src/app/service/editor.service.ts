import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecordService } from '@rero/ng-core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Deliver piece of data for EditorComponent: Record from BNF (aka Bibliothèque Nationale de France)
 */
export class EditorService {
  /**
   * Constructor
   * @param http HttpClient
   * @param recordService RecordService
   */
  constructor(
    private http: HttpClient,
    private recordService: RecordService
  ) { }

  /**
   * Get record from rero-ils API
   * @param ean EAN code
   */
  getRecordFromBNF(ean) {
    return this.http.get<any>(`/api/import/bnf/${ean}`).pipe(
      catchError(e => {
        if (e.status === 404) {
          return of(null);
        }
      })
    );
  }
}
