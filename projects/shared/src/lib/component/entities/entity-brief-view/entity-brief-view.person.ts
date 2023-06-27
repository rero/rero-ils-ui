import { Component, Inject, Input, OnInit } from '@angular/core';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';

@Component({
  selector: 'shared-remote-person-entity-brief-view',
  template: `
    <p *ngIf="dates">{{ dates | join : ' - ' }}</p>
    <p *ngIf="bibliographicInformation" [innerHTML]="bibliographicInformation | urlActive:'_blank' | nl2br"></p>
  `,
  providers: [ExtractSourceFieldPipe],
})
export class EntityBriefViewRemotePersonComponent implements OnInit {

  @Input() record: any;

  dates: Array<string> = [];
  bibliographicInformation: string = null;

  constructor(private pipe: ExtractSourceFieldPipe) { }

  ngOnInit(): void {
    this.dates = [
      this.pipe.transform(this.record.metadata, 'date_of_birth'),
      this.pipe.transform(this.record.metadata, 'date_of_death')
    ].filter(elem => elem);
    this.bibliographicInformation = (this.pipe.transform(this.record.metadata, 'biographical_information') || []).join('\n');
  }
}
