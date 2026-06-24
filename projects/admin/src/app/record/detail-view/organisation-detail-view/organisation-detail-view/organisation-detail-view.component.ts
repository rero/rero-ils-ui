// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { _, TranslateDirective } from '@ngx-translate/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';

@Component({
  selector: 'admin-organisation-detail-view',
  imports: [TranslateDirective, Accordion, AccordionPanel, AccordionHeader, AccordionContent],
  templateUrl: './organisation-detail-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDetailViewComponent {
  readonly record = input.required<any>();
  readonly type = input.required<string>();

  /** Homepage blocks display order, with their translated labels. */
  readonly blockOrder = [
    { key: 'left', label: _('Left block') },
    { key: 'center', label: _('Center block') },
    { key: 'right', label: _('Right block') },
  ] as const;
}
