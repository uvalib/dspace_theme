import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OnClickMenuItemModel } from '../../../../../../app/shared/menu/menu-item/models/onclick.model';
import { OnClickMenuItemComponent as BaseComponent } from '../../../../../../app/shared/menu/menu-item/onclick-menu-item.component';

/**
 * Component that renders a menu section of type ONCLICK (LibraOpen theme).
 */
@Component({
  selector: 'ds-onclick-menu-item',
  styleUrls: [
    '../../../../../../app/shared/menu/menu-item/menu-item.component.scss',
    '../../../../../../app/shared/menu/menu-item/onclick-menu-item.component.scss',
  ],
  templateUrl: './onclick-menu-item.component.html',
  standalone: true,
  imports: [TranslateModule],
})
export class OnClickMenuItemComponent extends BaseComponent {
  constructor(@Inject('itemModelProvider') item: OnClickMenuItemModel) {
    super(item);
  }
}
