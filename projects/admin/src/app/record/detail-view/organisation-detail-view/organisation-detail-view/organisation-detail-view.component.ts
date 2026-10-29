// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, input } from '@angular/core';
import { _, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from '@openng/optimus-ui/accordion';

@Component({
  selector: 'admin-organisation-detail-view',
  imports: [TranslatePipe, TranslateDirective, Accordion, AccordionPanel, AccordionHeader, AccordionContent],
  templateUrl: './organisation-detail-view.component.html',
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
