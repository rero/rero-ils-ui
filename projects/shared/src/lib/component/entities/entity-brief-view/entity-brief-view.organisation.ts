// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, OnInit, input, ChangeDetectionStrategy} from '@angular/core';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';
import { JoinPipe } from '../../../pipe/join.pipe';

@Component({
    selector: 'shared-remote-organisation-entity-brief-view',
    template: `
    @if (dates) {
      <p>{{ dates | join : ' - ' }}</p>
    }
  `,
    providers: [ExtractSourceFieldPipe],
    imports: [JoinPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityBriefViewRemoteOrganisationComponent implements OnInit {

  protected pipe: ExtractSourceFieldPipe = inject(ExtractSourceFieldPipe);

  readonly record = input<any>(undefined);

  dates: string[] = [];

  ngOnInit(): void {
    this.dates = [
      this.pipe.transform(this.record().metadata, 'date_of_establishment'),
      this.pipe.transform(this.record().metadata, 'date_of_termination')
    ].filter(elem => elem);
  }
}
