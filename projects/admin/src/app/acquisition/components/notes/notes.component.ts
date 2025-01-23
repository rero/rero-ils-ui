import { Component, input } from '@angular/core';

@Component({
  selector: 'admin-notes',
  templateUrl: './notes.component.html'
})
export class NotesComponent {

  notes = input<[{type, content}]>();
}
