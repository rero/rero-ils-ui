import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateDirective } from '@ngx-translate/core';

@Component({
  selector: 'admin-organisation-detail-view',
  imports: [TranslateDirective],
  templateUrl: './organisation-detail-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationDetailViewComponent {
  readonly record = input<any>();
  readonly type = input<string>('');
}