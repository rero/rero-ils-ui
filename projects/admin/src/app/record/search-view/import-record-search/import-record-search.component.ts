// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, ChangeDetectionStrategy, model, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecordSearchComponent, RecordSearchPageComponent, RecordSearchStore } from '@rero/ng-core';
import { Select } from 'primeng/select';

@Component({
  selector: 'admin-import-record-search',
  templateUrl: './import-record-search.component.html',
  imports: [RecordSearchComponent, Select, FormsModule],
  providers: [RecordSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportRecordSearchComponent extends RecordSearchPageComponent {

  private defaultOptions = { name: "10", size: 10 };

  private optionsValues = [
    { name: "10", size: 10 },
    { name: "20", size: 20 },
    { name: "50", size: 50 }
  ];

  protected options = signal(this.optionsValues);

  maxRecordsSelected = model<maxRecordSize>(this.defaultOptions);

  constructor() {
    super();

    effect(() => {
      if (this.maxRecordsSelected().size !== this.store.size()) {
        this.store.updateSize(this.maxRecordsSelected().size);
        let selected = this.optionsValues.find(e => e.size === this.store.size());
        if (!selected) {
          // Add custom size in the select menu
          selected = { name: String(this.store.size()), size: this.store.size() };
          const sortedEntries = [selected, ...this.optionsValues].sort((a, b) => a.size - b.size);
          this.options.set(sortedEntries);
        }
        this.maxRecordsSelected.set(selected);
      }
    });
  }
}

export type maxRecordSize = {
  name: string;
  size: number;
}
