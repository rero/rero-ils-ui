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
  /** Edition statement */
  editionStatement: any[] = [];
  /** Identified bye */
  identifiedBy: any[] = [];
  /** All notes without general */
  notesExceptGeneral: Record<string, string[]>;
  /** General notes only */
  notesGeneral: Record<string, string[]>;
  /** Provision activity original date */
  provisionActivityOriginalDate: any[] = [];
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
    this.processEditionStatement();
    this.processIdentifiedBy();
    this.processNotesExceptGeneral();
    this.processNotesGeneral();
    this.processProvisionActivityOriginalDate();
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

  /** Process cartographic attributes */
  private processCartographicAttributes(): void {
    const metadata = this.record()?.metadata;
    if ('cartographicAttributes' in metadata) {
      metadata.cartographicAttributes.forEach((attribute: any) => {
        if ('projection' in attribute || ('coordinates' in attribute && 'label' in attribute.coordinates)) {
          this.cartographicAttributes.push(attribute);
        }
      });
    }
  }

  /** Process edition statement */
  private processEditionStatement(): void {
    const metadata = this.record()?.metadata;
    if ('seriesStatement' in metadata) {
      metadata.seriesStatement.forEach((element: any) => {
        if ('_text' in element) {
          const elementText = element._text;
          const keys = Object.keys(elementText);
          const indexDefault = keys.indexOf('default');
          if (indexDefault > -1) {
            this.editionStatement.push(elementText.default);
            keys.splice(indexDefault, 1);
          }

          keys.forEach(key => {
            this.editionStatement.push(elementText[key]);
          });
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

  /** Process provision activity original date */
  private processProvisionActivityOriginalDate(): void {
    const metadata = this.record()?.metadata;
    if ('provisionActivity' in metadata) {
      this.provisionActivityOriginalDate = metadata.provisionActivity
      .filter((element: any) => element.key !== 'bf:Publication')
      .filter((provision: any) => 'original_date' in provision)
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
