// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, OnInit, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { DescriptionZoneComponent } from './description-zone/description-zone.component';
import { OtherEditionComponent } from './other-edition/other-edition.component';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { CallbackArrayFilterPipe, TranslateLanguagePipe, UpperCaseFirstPipe } from '@rero/ng-core';
import { KeyValuePipe } from '@angular/common';
import { DocumentProvisionActivityPipe } from '../../../pipe/document-provision-activity.pipe';
import { IdAttributePipe } from '../../../pipe/id-attribute.pipe';
import { SafeUrlPipe } from '../../../pipe/safe-url.pipe';

/** A provision activity of a document, as described by the `provisionActivity` field. */
type ProvisionActivity = {
  type: string;
  note?: string;
};

/** A temporal content coverage of a document, as described by MARC 045. */
type TemporalCoverage = {
  type: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  period_code?: string[];
};

@Component({
    selector: 'shared-document-description',
    templateUrl: './document-description.component.html',
    imports: [DescriptionZoneComponent, OtherEditionComponent, Bind, Tag, CallbackArrayFilterPipe, KeyValuePipe, TranslateLanguagePipe, TranslatePipe, UpperCaseFirstPipe, DocumentProvisionActivityPipe, IdAttributePipe, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentDescriptionComponent implements OnInit {

  public translateService: TranslateService = inject(TranslateService);

  /** Document record */
  readonly record = input<any>();

  /** View code for public URL */
  readonly viewcode = input<string>(null);

  /** Is public view */
  readonly isPublicView = input(false);
  /** Cartographic attributes */
  cartographicAttributes: any[] = [];
  /** Series statement */
  seriesStatement: any[] = [];
  /** Identified bye */
  identifiedBy: any[] = [];
  /** All notes without general */
  notesExceptGeneral: Record<string, string[]>;
  /** General notes only */
  notesGeneral: Record<string, string[]>;
  /** Provision activity notes, grouped by provision activity type */
  provisionActivityNotes: Record<string, string[]>;
  /** Provision activity original date */
  provisionActivityOriginalDate: any[] = [];
  /** Temporal coverages, formatted for display */
  temporalCoverages: string[] = [];
  /** Title variants */
  titleVariants: any = {};
  /** Work access point */
  workAccessPoint: any[] = [];

  /**
   * Get Current language interface
   * @return string - language
   */
  get currentLanguage() {
    return this.translateService.getCurrentLang();
  }

  /** On init hook */
  ngOnInit(): void {
    this.processCartographicAttributes();
    this.processIdentifiedBy();
    this.processNotesExceptGeneral();
    this.processNotesGeneral();
    this.processProvisionActivityNote();
    this.processProvisionActivityOriginalDate();
    this.processSeriesStatement();
    this.processTemporalCoverage();
    this.processTitleVariants();
    this.processWorkAccessPoint();
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

  /** Process cartographic attributes */
  private processCartographicAttributes(): void {
    const metadata = this.record()?.metadata;
    if ('cartographicAttributes' in metadata) {
      metadata.cartographicAttributes.forEach((attribute: any) => {
        if (
          'projection' in attribute
          || 'equinox' in attribute
          || ('coordinates' in attribute && 'label' in attribute.coordinates)
        ) {
          this.cartographicAttributes.push(attribute);
        }
      });
    }
  }

  /** Process identified by */
  private processIdentifiedBy(): void {
    const metadata = this.record()?.metadata;
    if ('identifiedBy' in metadata) {
      metadata.identifiedBy.forEach((id: any) => {
        const details = [];
        // Replace bf:Local by source
        const idType = (id.type === 'bf:Local') ? id.source : id.type;
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
        this.identifiedBy.push({
          type: idType,
          value: id.value,
          details: details.join(', ')
        });
      });
    }
  }

  /** Process General notes */
  private processNotesGeneral(): void {
    const metadata = this.record()?.metadata;
    if ('note' in metadata) {
      this.notesGeneral = this._sortedNotesByType(
        metadata.note.filter((el: any) => el.noteType === 'general')
      );
    }
  }

  /** Process all without general */
  private processNotesExceptGeneral(): void {
    const metadata = this.record()?.metadata;
    if ('note' in metadata) {
      this.notesExceptGeneral = this._sortedNotesByType(
        metadata.note.filter((el: any) => el.noteType !== 'general')
      );
    }
  }

  /** Process provision activity notes.*/
  private processProvisionActivityNote(): void {
    const metadata = this.record()?.metadata;
    if ('provisionActivity' in metadata) {
      const notesByType: Record<string, string[]> = {};
      metadata.provisionActivity
        .filter((provision: ProvisionActivity) => provision.note)
        .forEach((provision: ProvisionActivity) => {
          notesByType[provision.type] ??= [];
          notesByType[provision.type].push(provision.note);
        });
      if (Object.keys(notesByType).length > 0) {
        this.provisionActivityNotes = notesByType;
      }
    }
  }

  /**
   * Process provision activity original date, for every type but publication.
   * The raw provision activities carry a `type`, the `key` of the template filters
   * only exists once they have been grouped by the `documentProvisionActivity` pipe.
   */
  private processProvisionActivityOriginalDate(): void {
    const metadata = this.record()?.metadata;
    if ('provisionActivity' in metadata) {
      this.provisionActivityOriginalDate = metadata.provisionActivity
      .filter((provision: any) => provision.type !== 'bf:Publication')
      .filter((provision: any) => 'original_date' in provision)
    }
  }

  /**
   * Process series statement.
   * The statement of the 'default' language comes first, the translations follow.
   */
  private processSeriesStatement(): void {
    const metadata = this.record()?.metadata;
    if ('seriesStatement' in metadata) {
      metadata.seriesStatement.forEach((statement: any) => {
        const texts = statement._text ?? [];
        this.seriesStatement.push(
          ...texts.filter((text: any) => text.language === 'default'),
          ...texts.filter((text: any) => text.language !== 'default')
        );
      });
    }
  }

  /** Process temporal coverage.*/
  private processTemporalCoverage(): void {
    const metadata = this.record()?.metadata;
    if ('temporalCoverage' in metadata) {
      metadata.temporalCoverage.forEach((coverage: TemporalCoverage) => {
        const parts: string[] = [];
        if (coverage.date) {
          parts.push(this._formatTemporalDate(coverage.date));
        } else if (coverage.start_date || coverage.end_date) {
          parts.push(
            [coverage.start_date, coverage.end_date]
              .filter((date: string) => date)
              .map((date: string) => this._formatTemporalDate(date))
              .join(' - ')
          );
        }
        if (coverage.period_code?.length) {
          parts.push(`(${coverage.period_code.join(', ')})`);
        }
        if (parts.length > 0) {
          this.temporalCoverages.push(parts.join(' '));
        }
      });
    }
  }

  /** Process title variants */
  private processTitleVariants(): void {
    const metadata = this.record()?.metadata;
    if ('title' in metadata) {
      const titles = metadata.title.filter((title: any) => title.type !== 'bf:Title');
      titles.forEach((title: any) => {
        if (!(title.type in this.titleVariants)) {
          this.titleVariants[title.type] = [];
        }
        const result = [];
        result.push(title.mainTitle[0].value);
        if ('subtitle' in title) {
          result.push(title.subtitle[0].value);
        }
        let variantTitle = result.join(': ');
        const variantData = [];
        if ('part' in title) {
          title.part.forEach((part: any) => {
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
        this.titleVariants[title.type].push(variantTitle);
      });
    }
  }

  /** Process work access point */
  private processWorkAccessPoint(): void {
    const metadata = this.record()?.metadata;
    if ('work_access_point' in metadata) {
      metadata.work_access_point.forEach((workAccess: any) => {
        let agentFormatted = '';
        if (workAccess.creator) {
          const agent = workAccess.creator;
          if ('bf:Person' === agent.type) {
            // Person
            const name = [];
            if (agent.preferred_name) {
              name.push(agent.preferred_name);
            }
            if (agent.numeration) {
              name.push(agent.numeration);
            } else {
              if (agent.fuller_form_of_name) {
                name.push(' (' + agent.agent.fuller_form_of_name + ')');
              }
            }
            if (name.length > 0) {
              agentFormatted += name.join(' ') + ', ';
            }
            if (agent.numeration && agent.qualifier) {
              agentFormatted += agent.qualifier + ', ';
            }
            const dates = [];
            ['date_of_birth', 'date_of_death'].forEach((key: string) => {
              if (key in agent) {
                dates.push(agent[key]);
              }
            });
            if (dates.length > 0) {
              agentFormatted += dates.join('-') + '. ';
            }
            if (!(agent.numeration) && agent.qualifier) {
              agentFormatted += agent.qualifier + '. ';
            }
          } else {
            // Organisation
            if (agent.preferred_name) {
              agentFormatted += agent.preferred_name + '. ';
            }
            if (agent.subordinate_unit) {
              agent.subordinate_unit.forEach((sub: any) => {
                agentFormatted += sub + '. ';
              });
            }
            if (agent.numbering || agent.conference_date || agent.place) {
              const conf = [];
              ['numbering', 'conference_date', 'place'].forEach((key: string) => {
                if (key in agent) {
                  conf.push(agent[key]);
                }
              });
              if (conf.length > 0) {
                agentFormatted += '(' + conf.join(' : ') + ') ';
              }
            }
          }
        }
        agentFormatted += workAccess.title + '. ';
        if (workAccess.part) {
          workAccess.part.forEach((part: any) => {
            ['partNumber', 'partName'].forEach((key: string) => {
              if (key in part) {
                agentFormatted += part[key] + '. ';
              }
            });
          });
        }
        if (workAccess.form_subdivision) {
          agentFormatted += workAccess.form_subdivision.join('. ') + '. ';
        }
        if (workAccess.miscellaneous_information) {
          agentFormatted += workAccess.miscellaneous_information + '. ';
        }
        if (workAccess.language) {
          agentFormatted += this.translateService.instant('lang_' + workAccess.language) + '. ';
        }
        if (workAccess.medium_of_performance_for_music) {
          agentFormatted += workAccess.medium_of_performance_for_music.join('. ') + '. ';
        }
        if (workAccess.key_for_music) {
          agentFormatted += workAccess.key_for_music + '. ';
        }
        if (workAccess.arranged_statement_for_music) {
          agentFormatted += workAccess.arranged_statement_for_music + '. ';
        }
        if (workAccess.date_of_work) {
          agentFormatted += workAccess.date_of_work + '. ';
        }
        this.workAccessPoint.push(agentFormatted.trim());
      });
    }
  }

  /**
   * Strip the leading '+' of a temporal coverage date.
   * The '-' sign of BCE dates is kept.
   * @param date - the raw date, i.e. '+1945-05-08'
   * @returns the date without its leading '+'
   */
  private _formatTemporalDate(date: string): string {
    return date.startsWith('+') ? date.slice(1) : date;
  }

  /**
   * Sorted notes by type
   * @param notes - Array of notes
   * @returns sorted by type or null
   */
  private _sortedNotesByType(notes: { noteType: string, label: string }[]): any {
    if (notes.length === 0) {
      return;
    }
    const sortedByType = {};
    notes.forEach(note => {
      if (!(note.noteType in sortedByType)) {
        sortedByType[note.noteType] = [];
      }
      sortedByType[note.noteType].push(note.label);
    });
    return sortedByType;
  }
}
