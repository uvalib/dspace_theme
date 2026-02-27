import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  Component,
  Injector,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';

import { MenuComponent } from '../../../../../../app/shared/menu/menu.component';
import { MenuService } from '../../../../../../app/shared/menu/menu.service';
import { MenuID } from '../../../../../../app/shared/menu/menu-id.model';
import { ThemeService } from '../../../../../../app/shared/theme-support/theme.service';
import { DsoEditMenuComponent as BaseComponent } from '../../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';

/**
 * Component representing the edit menu and other menus on the dspace object pages (LibraOpen theme).
 */
@Component({
  selector: 'ds-dso-edit-menu',
  styleUrls: ['../../../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component.scss'],
  templateUrl: './dso-edit-menu.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgComponentOutlet,
  ],
})
export class DsoEditMenuComponent extends BaseComponent {
}
