import { Component, Inject, Input, OnInit } from '@angular/core';
import { ExtractSourceFieldPipe } from '../../../pipe/extract-source-field.pipe';

@Component({
  selector: 'shared-remote-organisation-entity-brief-view',
  template: `<p *ngIf="dates">{{ dates | join : ' - ' }}</p>`,
  providers: [ExtractSourceFieldPipe],
})
export class EntityBriefViewRemoteOrganisationComponent implements OnInit {

  @Input() record: any;

  dates: Array<string> = [];

  constructor(private pipe: ExtractSourceFieldPipe) { }

  ngOnInit(): void {
    this.dates = [
      this.pipe.transform(this.record.metadata, 'date_of_establishment'),
      this.pipe.transform(this.record.metadata, 'date_of_termination')
    ].filter(elem => elem);
  }
}
