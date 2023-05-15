/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
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
import { AfterContentChecked, Directive, ElementRef, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[noContent]',
})
/**
 * This directive is used for ng-content.
 * It allow to set a default content if no content is injected
 * Usage:
 * <h4 [noContent]="noTitle"><ng-content select="[title]"></ng-content></h4>
 * <ng-template #noTitle>...</ng-template>
 */
export class NoContentDirective implements AfterContentChecked {
  /** Template reference */
  @Input() noContent: TemplateRef<any>;

  /** html element */
  private element: HTMLElement;
  /** Determine if the content is present */
  private hasContent = true;

  /**
   * Constructor
   * @param element - ElementRef
   * @param container - ViewContainerRef
   * @param renderer - Renderer2
   */
  constructor(
    element: ElementRef,
    private container: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.element = element.nativeElement;
  }

  /** ngAfterContentChecked hook */
  ngAfterContentChecked(): void {
    let hasContent = false;
    for (let i = this.element.childNodes.length-1; i >= 0; --i) {
      const node = this.element.childNodes[i];
      if (node.nodeType === 1 || node.nodeType === 3) {
        hasContent = true;
        break;
      }
    }
    if (hasContent !== this.hasContent) {
      this.hasContent = hasContent;
      if (hasContent) {
        this.renderer.removeClass(this.element, 'is-empty');
        this.container.clear();
      } else {
        this.renderer.addClass(this.element, 'is-empty');
        this.container.createEmbeddedView(this.noContent);
      }
    }
  }
}
