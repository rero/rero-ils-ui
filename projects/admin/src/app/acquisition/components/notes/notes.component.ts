import { Component, input } from '@angular/core';

@Component({
    selector: 'admin-notes',
    templateUrl: './notes.component.html',
    standalone: false
})
export class NotesComponent {

  notes = input<[{type, content}]>();
}
