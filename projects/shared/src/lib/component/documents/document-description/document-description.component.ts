// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LangChangeEvent, TranslateService, TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
import { DescriptionZoneComponent } from './description-zone/description-zone.component';
import { OtherEditionComponent } from './other-edition/other-edition.component';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { CallbackArrayFilterPipe, TranslateLanguagePipe, UpperCaseFirstPipe } from '@rero/ng-core';
import { KeyValuePipe } from '@angular/common';
import { DocumentProvisionActivityPipe } from '../../../pipe/document-provision-activity.pipe';
import { IdAttributePipe } from '../../../pipe/id-attribute.pipe';
import { SafeUrlPipe } from '../../../pipe/safe-url.pipe';
import {
  CartographicAttribute,
  DocumentMetadata,
  Identifier,
  LocalizedText,
  Note,
  ProvisionActivity,
  RawIdentifier,
  RawTitle,
  SeriesStatement,
  TemporalCoverage,
  WorkAccessAgent,
  WorkAccessPoint
} from './model/document-description-model';

@Component({
    selector: 'shared-document-description',
    templateUrl: './document-description.component.html',
    imports: [DescriptionZoneComponent, OtherEditionComponent, Bind, Tag, CallbackArrayFilterPipe, KeyValuePipe, TranslateLanguagePipe, TranslatePipe, UpperCaseFirstPipe, DocumentProvisionActivityPipe, IdAttributePipe, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentDescriptionComponent {

  public translateService: TranslateService = inject(TranslateService);

  /** Document record */
  readonly record = input<any>();

  /** View code for public URL */
  readonly viewcode = input<string>(null);

  /** Is public view */
  readonly isPublicView = input(false);

  /** Current interface language */
  private readonly language = toSignal(
    this.translateService.onLangChange.pipe(map((event: LangChangeEvent) => event.lang)),
    { initialValue: this.translateService.getCurrentLang() }
  );

  /**
   * Metadata of the current record.
   * The template and all the derived fields below read this signal, so that navigating
   * to another document — which only rebinds the `record` input, without
   * recreating this component — refreshes the whole description.
   */
  protected readonly metadata: Signal<DocumentMetadata> = computed(() => this.record()?.metadata ?? {});

  /** All notes of the document */
  private readonly notes = computed<Note[]>(() => this.metadata().note ?? []);

  /** Cartographic attributes */
  readonly cartographicAttributes: Signal<CartographicAttribute[]> = computed(() =>
    (this.metadata().cartographicAttributes ?? []).filter((attribute: CartographicAttribute) =>
      'projection' in attribute
      || 'equinox' in attribute
      || ('coordinates' in attribute && 'label' in attribute.coordinates)
    )
  );

  /**
   * Series statements.
   * The statement of the 'default' language comes first, the translations follow.
   */
  readonly seriesStatement: Signal<LocalizedText[]> = computed(() => {
    const statements: LocalizedText[] = [];
    (this.metadata().seriesStatement ?? []).forEach((statement: SeriesStatement) => {
      const texts = statement._text ?? [];
      statements.push(
        ...texts.filter((text: LocalizedText) => text.language === 'default'),
        ...texts.filter((text: LocalizedText) => text.language !== 'default')
      );
    });
    return statements;
  });

  /** Identified by */
  readonly identifiedBy: Signal<Identifier[]> = computed(() =>
    (this.metadata().identifiedBy ?? []).map((id: RawIdentifier) => {
      const details = [];
      // Format qualifier, status and note
      if (id.qualifier) {
        details.push(id.qualifier);
      }
      if (id.status) {
        details.push(id.status);
      }
      if (id.note) {
        details.push(id.note);
      }
      return {
        // Replace bf:Local by source, when the identifier provides one
        type: (id.type === 'bf:Local') ? (id.source ?? id.type) : id.type,
        value: id.value,
        details: details.join(', ')
      };
    })
  );

  /** General notes only */
  readonly notesGeneral: Signal<Record<string, string[]> | undefined> = computed(() =>
    this.sortedNotesByType(this.notes().filter((note: Note) => note.noteType === 'general'))
  );

  /** All notes without general */
  readonly notesExceptGeneral: Signal<Record<string, string[]> | undefined> = computed(() =>
    this.sortedNotesByType(this.notes().filter((note: Note) => note.noteType !== 'general'))
  );

  /** Provision activity notes, grouped by provision activity type */
  readonly provisionActivityNotes: Signal<Record<string, string[]> | undefined> = computed(() => {
    const notesByType: Record<string, string[]> = {};
    (this.metadata().provisionActivity ?? [])
      .filter((provision: ProvisionActivity) => provision.note)
      .forEach((provision: ProvisionActivity) => {
        notesByType[provision.type] ??= [];
        notesByType[provision.type].push(provision.note);
      });
    return Object.keys(notesByType).length > 0 ? notesByType : undefined;
  });

  /**
   * Provision activity original date, for every type but publication.
   * The raw provision activities carry a `type`, the `key` of the template filters
   * only exists once they have been grouped by the `documentProvisionActivity` pipe.
   */
  readonly provisionActivityOriginalDate: Signal<ProvisionActivity[]> = computed(() =>
    (this.metadata().provisionActivity ?? [])
      .filter((provision: ProvisionActivity) => provision.type !== 'bf:Publication')
      .filter((provision: ProvisionActivity) => 'original_date' in provision)
  );

  /** Temporal coverages, formatted for display */
  readonly temporalCoverages: Signal<string[]> = computed(() => {
    const coverages: string[] = [];
    (this.metadata().temporalCoverage ?? []).forEach((coverage: TemporalCoverage) => {
      const parts: string[] = [];
      if (coverage.date) {
        parts.push(this.formatTemporalDate(coverage.date));
      } else if (coverage.start_date || coverage.end_date) {
        parts.push(
          [coverage.start_date, coverage.end_date]
            .filter((date: string) => date)
            .map((date: string) => this.formatTemporalDate(date))
            .join(' - ')
        );
      }
      if (coverage.period_code?.length) {
        parts.push(`(${coverage.period_code.join(', ')})`);
      }
      if (parts.length > 0) {
        coverages.push(parts.join(' '));
      }
    });
    return coverages;
  });

  /** Title variants, grouped by title type */
  readonly titleVariants: Signal<Record<string, string[]>> = computed(() => {
    const variants: Record<string, string[]> = {};
    (this.metadata().title ?? [])
      .filter((title: RawTitle) => title.type !== 'bf:Title')
      .forEach((title: RawTitle) => {
        variants[title.type] ??= [];
        const result = [];
        result.push(title.mainTitle[0].value);
        if ('subtitle' in title) {
          result.push(title.subtitle[0].value);
        }
        let variantTitle = result.join(': ');
        const variantData = [];
        if ('part' in title) {
          title.part.forEach((part) => {
            const variantNumberData = [];
            if ('partNumber' in part) {
              variantNumberData.push(part.partNumber[0].value);
            }
            if ('partName' in part) {
              variantNumberData.push(part.partName[0].value);
            }
            variantData.push(variantNumberData.join(', '));
          });
        }
        if (variantData.length > 0) {
          variantTitle += `. ${variantData.join('. ')}`;
        }
        variants[title.type].push(variantTitle);
      });
    return variants;
  });

  /**
   * Work access points.
   * Depends on the interface language, as the formatted value holds a translated
   * language label: a language change has to invalidate the computed values.
   */
  readonly workAccessPoint: Signal<string[]> = computed(() => {
    // Read the language to depend on it
    this.language();
    return (this.metadata().work_access_point ?? [])
      .map((workAccess: WorkAccessPoint) => this.formatWorkAccessPoint(workAccess));
  });

  /**
   * Get Current language interface
   * @return string - language
   */
  get currentLanguage() {
    return this.translateService.getCurrentLang();
  }

  /**
   * Allow to filter provisionActivity keeping only activities that aren't 'Publication'
   * @param element: the element to check
   * @return True if element isn't a 'Publication', False otherwise
   */
  filterNotPublicationProvisionActivity(element: any): boolean {
    return ('key' in element && element.key !== 'bf:Publication');
  }

  /**
   * Format the qualifiers of a classification: type, edition and assigning agency.
   * @param classification - the classification to format
   * @returns the available qualifiers, joined by a comma
   */
  classificationQualifiers(classification: { type: string, edition?: string, assigner?: string }): string {
    return [
      this.translateService.instant(classification.type),
      classification.edition,
      classification.assigner
    ].filter((qualifier: string) => qualifier).join(', ');
  }

  /**
   * Format the linear ratios of a scale.
   * @param scale - the scale to format
   * @returns the horizontal and vertical ratios, or null when neither is set
   */
  scaleRatios(scale: { ratio_linear_horizontal?: string, ratio_linear_vertical?: string }): string | null {
    const ratios = [scale.ratio_linear_horizontal, scale.ratio_linear_vertical]
      .filter((ratio: string) => ratio);
    return ratios.length > 0 ? ratios.join(' / ') : null;
  }

  /**
   * Format a work access point for display.
   * @param workAccess - the work access point to format
   * @returns the parts of the access point, each ended by a period
   */
  private formatWorkAccessPoint(workAccess: WorkAccessPoint): string {
    const parts: string[] = [];
    if (workAccess.creator) {
      parts.push(...this.formatWorkAccessCreator(workAccess.creator));
    }
    parts.push(workAccess.title);
    (workAccess.part ?? []).forEach((part) => {
      parts.push(part.partNumber, part.partName);
    });
    parts.push(
      ...(workAccess.form_subdivision ?? []),
      workAccess.miscellaneous_information,
      workAccess.language ? this.translateService.instant('lang_' + workAccess.language) : undefined,
      ...(workAccess.medium_of_performance_for_music ?? []),
      workAccess.key_for_music,
      workAccess.arranged_statement_for_music,
      workAccess.date_of_work
    );
    return parts.filter((part: string) => part).map((part: string) => `${part}.`).join(' ');
  }

  /**
   * Format the creator of a work access point.
   * @param agent - the creator to format
   * @returns the parts of the creator, to be ended by a period by the caller
   */
  private formatWorkAccessCreator(agent: WorkAccessAgent): string[] {
    if ('bf:Person' === agent.type) {
      const name = [agent.preferred_name];
      if (agent.numeration) {
        name.push(agent.numeration);
      } else if (agent.fuller_form_of_name) {
        name.push(`(${agent.fuller_form_of_name})`);
      }
      // The name, the qualifier of a numbered person and the dates are comma separated
      const person = [
        name.filter((element: string) => element).join(' '),
        agent.numeration ? agent.qualifier : undefined,
        [agent.date_of_birth, agent.date_of_death].filter((date: string) => date).join('-')
      ];
      return [
        person.filter((element: string) => element).join(', '),
        // The qualifier of an unnumbered person is a part of its own
        agent.numeration ? undefined : agent.qualifier
      ];
    }
    // Organisation
    const conference = [agent.numbering, agent.conference_date, agent.place]
      .filter((element: string) => element);
    return [
      agent.preferred_name,
      ...(agent.subordinate_unit ?? []),
      conference.length > 0 ? `(${conference.join(' : ')})` : undefined
    ];
  }

  /**
   * Strip the leading '+' of a temporal coverage date.
   * The '-' sign of BCE dates is kept.
   * @param date - the raw date, i.e. '+1945-05-08'
   * @returns the date without its leading '+'
   */
  private formatTemporalDate(date: string): string {
    return date.startsWith('+') ? date.slice(1) : date;
  }

  /**
   * Sorted notes by type
   * @param notes - Array of notes
   * @returns sorted by type or undefined when there is no note
   */
  private sortedNotesByType(notes: Note[]): Record<string, string[]> | undefined {
    if (notes.length === 0) {
      return undefined;
    }
    const sortedByType: Record<string, string[]> = {};
    notes.forEach(note => {
      sortedByType[note.noteType] ??= [];
      sortedByType[note.noteType].push(note.label);
    });
    return sortedByType;
  }
}
