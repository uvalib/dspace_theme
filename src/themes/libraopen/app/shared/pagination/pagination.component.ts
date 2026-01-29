import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../../../../app/shared/btn-disabled.directive';
import { PaginationComponent as BaseComponent } from '../../../../../app/shared/pagination/pagination.component';
import { EnumKeysPipe } from '../../../../../app/shared/utils/enum-keys-pipe';

/**
 * Theme-specific pagination component that removes RSS feed buttons.
 */
@Component({
  selector: 'ds-pagination',
  styleUrls: ['../../../../../app/shared/pagination/pagination.component.scss'],
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    EnumKeysPipe,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgClass,
    TranslateModule,
  ],
})
export class PaginationComponent extends BaseComponent {
}
