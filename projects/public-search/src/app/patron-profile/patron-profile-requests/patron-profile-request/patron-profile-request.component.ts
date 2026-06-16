// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe, RecordData } from '@rero/ng-core';
import { OpenCloseButtonComponent } from '@rero/shared';
import { ButtonModule } from 'primeng/button';
import { PatronProfileDocumentComponent } from '../../patron-profile-document/patron-profile-document.component';
import { PatronProfileStore } from '../../store/patron-profile.store';

@Component({
  selector: 'public-search-patron-profile-request',
  templateUrl: './patron-profile-request.component.html',
  imports: [NgClass, NgTemplateOutlet, TranslateDirective, TranslatePipe, DateTranslatePipe, OpenCloseButtonComponent, ButtonModule, PatronProfileDocumentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronProfileRequestComponent {

  protected readonly store = inject(PatronProfileStore);

  // COMPONENT ATTRIBUTES =====================================================
  /** Request record */
  record = input<RecordData>();

  /** Document section is collapsed */
  isCollapsed = true;

  /** Cancel in progress */
  readonly cancelInProgress = computed(
    () => this.store.cancellingRequestPid() === this.record()?.metadata.pid
  );

  // GETTER & SETTER ==========================================================
  /** Get current viewcode */
  get viewcode(): string {
    return this.store.currentPatron()?.organisation.code ?? '';
  }

  // COMPONENTS FUNCTIONS =====================================================
  /** Cancel a request */
  cancel(): void {
    const requestPid = this.record()?.metadata.pid;
    if (typeof requestPid === 'string') this.store.cancelPatronRequest(requestPid);
  }
}
