import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Nl2brPipe } from '@rero/ng-core';

@Component({
  selector: 'admin-notes',
  templateUrl: './notes.component.html',
  imports: [TranslatePipe, Nl2brPipe],
})
export class NotesComponent {
  notes = input<{ type: any; content: any }[]>();
}
