/*
 * RERO ILS UI
 * Copyright (C) 2023-2024 RERO
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
import { AfterContentChecked, Directive, ElementRef, inject, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

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

  protected element: ElementRef = inject(ElementRef);
  protected container: ViewContainerRef = inject(ViewContainerRef);
  protected renderer: Renderer2 = inject(Renderer2);

  /** Template reference */
  @Input() noContent: TemplateRef<any>;

  /** Determine if the content is present */
  private hasContent = true;

  /** ngAfterContentChecked hook */
  ngAfterContentChecked(): void {
    let hasContent = false;
    for (let i = this.element.nativeElement.childNodes.length-1; i >= 0; --i) {
      const node = this.element.nativeElement.childNodes[i];
      if (node.nodeType === 1 || node.nodeType === 3) {
        hasContent = true;
        break;
      }
    }
    if (hasContent !== this.hasContent) {
      this.hasContent = hasContent;
      if (hasContent) {
        this.renderer.removeClass(this.element.nativeElement, 'is-empty');
        this.container.clear();
      } else {
        this.renderer.addClass(this.element.nativeElement, 'is-empty');
        this.container.createEmbeddedView(this.noContent);
      }
    }
  }
}
