import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainTitleService {

  constructor() { }

  /**
   * Get main title
   * @param titleMetadata: document title metadata
   */
  getMainTitle(titleMetadata: any): string {
    let mainTitle: string = null;
    titleMetadata.forEach(metadata => {
      if (metadata.type === 'bf:Title') {
        mainTitle = metadata._text;
      }
    });
    return mainTitle;
  }
}
