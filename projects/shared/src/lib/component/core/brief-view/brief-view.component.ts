import { AfterContentInit, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { ReroTemplateDirective } from '../../../directive/rero-template.directive';

export interface BriefViewTag {
  label: string
  [key:string]: any;
}


@Component({
  selector: 'shared-brief-view',
  templateUrl: './brief-view.component.html',
  styleUrls: ['./brief-view.component.scss']
})
export class BriefViewComponent implements AfterContentInit {

  @Input() link: any;
  @Input() title: any;
  @Input() tags: Array<BriefViewTag>;

  @ContentChildren(ReroTemplateDirective) templates: QueryList<ReroTemplateDirective> | null;

  iconTemplate: TemplateRef<any> | null;
  titleTemplate: TemplateRef<any> | null;
  contentTemplate: TemplateRef<any> | null;
  tagsTemplate: TemplateRef<any> | null;

  constructor() { }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'icon':
          this.iconTemplate = item.template;
          break;
        case 'title':
          this.titleTemplate = item.template;
          break;
        case 'content':
          this.contentTemplate = item.template;
          break;
        case 'tags':
          this.tagsTemplate = item.template;
          break;
      }
    });
  }

}
