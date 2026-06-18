// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Nl2brPipe, RecordData } from '@rero/ng-core';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';
import { JoinPipe } from '../../../pipe/join.pipe';
import { UrlActivePipe } from '../../../pipe/url-active.pipe';

@Component({
  selector: 'shared-remote-person-entity-brief-view',
  template: `
    @if (dates().length) {
      <p>{{ dates() | join : ' - ' }}</p>
    }
    @if (bibliographicInformation()) {
      <p [innerHTML]="bibliographicInformation() | urlActive:'_blank' | nl2br"></p>
    }
  `,
  providers: [ExtractSourceFieldPipe],
  imports: [Nl2brPipe, JoinPipe, UrlActivePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityBriefViewRemotePersonComponent {

  protected pipe: ExtractSourceFieldPipe = inject(ExtractSourceFieldPipe);

  readonly record = input.required<RecordData>();

  dates = computed(() =>
    [
      this.pipe.transform(this.record().metadata, 'date_of_birth'),
      this.pipe.transform(this.record().metadata, 'date_of_death'),
    ].filter(Boolean) as string[]
  );

  bibliographicInformation = computed(() =>
    (this.pipe.transform(this.record().metadata, 'biographical_information') || []).join('\n') || undefined
  );
}
