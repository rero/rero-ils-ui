/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'admin-document-description',
  templateUrl: './document-description.component.html'
})
export class DocumentDescriptionComponent {

  @Input() record: any;

  /**
   * Get Current language interface
   * @return string - language
   */
  get currentLanguage() {
    return this.translateService.currentLang;
  }

  // ---- FIELDS

  /** Get cartographic attributes */
  get cartographicAttributes(): any[] {
    const cartographic = [];
    if ('cartographicAttributes' in this.record.metadata) {
      this.record.metadata.cartographicAttributes.forEach((attribute: any) => {
        if ('projection' in attribute || ('coordinates' in attribute && 'label' in attribute.coordinates)) {
          cartographic.push(attribute);
        }
      });
    }
    return cartographic;
  }

  /** Get list of document edition statement */
  get editionStatement(): any[] {
    const results = [];
    if ('seriesStatement' in this.record.metadata) {
      this.record.metadata.seriesStatement.forEach((element: any) => {
        if ('_text' in element) {
          const elementText = element._text;
          const keys = Object.keys(elementText);
          const indexDefault = keys.indexOf('default');
          if (indexDefault > -1) {
            results.push(elementText.default);
            keys.splice(indexDefault, 1);
          }

          keys.forEach(key => {
            results.push(elementText[key]);
          });
        }
      });
    }
    return results;
  }

  /** Get list of document identifiers */
  get identifiedBy(): any[] {
    const identifiers = [];
    if ('identifiedBy' in this.record.metadata) {
      this.record.metadata.identifiedBy.forEach((id: any) => {
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
        identifiers.push({
          type: idType,
          value: id.value,
          details: details.join(', ')
        });
      });
    }
    return identifiers;
  }

  /** Get notes except general type */
  get notesExceptGeneral(): any {
    if ('note' in this.record.metadata) {
      return this._sortedNotesByType(
        this.record.metadata.note.filter((el: any) => el.noteType !== 'general')
      );
    }
    return;
  }

  /** Get notes general only */
  get notesGeneral(): any {
    if ('note' in this.record.metadata) {
      return this._sortedNotesByType(
        this.record.metadata.note.filter((el: any) => el.noteType === 'general')
      );
    }
    return;
  }

  /**
   * Allow to filter provisionActivity keeping only activities that aren't 'Publication'
   * @param element: the element to check
   * @return True if element isn't a 'Publication', False otherwise
   */
   filterNotPublicationProvisionActivity(element: any): boolean {
    return ('key' in element && element.key !== 'bf:Publication');
  }

  /** Get provision activity with available original_date field */
  get provisionActivityOriginalDate() {
    return ('provisionActivity' in this.record.metadata)
    ? this.record.metadata.provisionActivity
      .filter((element: any) => element.key !== 'bf:Publication')
      .filter((provision: any) => 'original_date' in provision)
    : [];
  }

  /** Get title variants by type */
  get titleVariants(): any {
    const variants = {};
    if ('title' in this.record.metadata) {
      const titles = this.record.metadata.title.filter((title: any) => title.type !== 'bf:Title');
      titles.forEach((title: any) => {
        if (!(title.type in variants)) {
          variants[title.type] = [];
        }
        const result = [];
        result.push(title.mainTitle[0].value);
        if ('subtitle' in title) {
          result.push(title.subtitle[0].value);
        }
        variants[title.type].push(result.join(': '));
      });
    }
    return variants;
  }

  /** Get work access point */
  get workAccessPoint(): string[] {
    const work = [];
    if ('work_access_point' in this.record.metadata) {
      this.record.metadata.work_access_point.forEach((workAccess: any) => {
        let agentFormatted = '';
        if (workAccess.agent) {
          const agent = workAccess.agent;
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
        work.push(agentFormatted.trim());
      });
    }
    return work;
  }

  /**
   * Constructor
   * @param translateService - TranslateService
   */
  constructor(public translateService: TranslateService) {}

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
