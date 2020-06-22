import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notesFormat'
})
export class NotesFormatPipe implements PipeTransform {

  transform(notes: any): any {
    if (notes) {
      const notesText = {};
      for (const note of notes) {
        if (!(note.noteType in notesText)) {
          notesText[note.noteType] = [note.label];
        } else {
          notesText[note.noteType].push(note.label);
        }
      }
      return notesText;
    }
    return null;

  }
}
