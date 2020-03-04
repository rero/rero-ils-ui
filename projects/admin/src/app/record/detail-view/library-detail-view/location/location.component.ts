import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RecordUiService } from '@rero/ng-core';
import { RecordPermissionMessageService } from 'projects/admin/src/app/service/record-permission-message.service';

@Component({
  selector: 'admin-location',
  templateUrl: './location.component.html'
})
export class LocationComponent {

  /** The location whose details are displayed */
  @Input() location: any;

  /** Delete location event emitter */
  @Output() deleteLocation = new EventEmitter();

  /** Constructor */
  constructor(
    private recordUiService: RecordUiService,
    private recordPermissionMessage: RecordPermissionMessageService
  ) { }

  /**
   * Delete the location
   * @param locationPid - location PID
   */
  delete(locationPid: string) {
    this.recordUiService.deleteRecord('locations', locationPid).subscribe((success: boolean) => {
      if (success) {
        this.deleteLocation.emit(locationPid);
      }
    });
  }

  /**
   * Show a message after deletion action
   * @param location : object - location concerned by the delete action
   */
  public showDeleteMessage(location: object) {
    const message = this.recordPermissionMessage.generateMessage(location);
    this.recordUiService.showDeleteMessage(message);
  }

}
