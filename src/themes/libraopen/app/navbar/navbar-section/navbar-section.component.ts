import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';

import { MenuService } from '../../../../../app/shared/menu/menu.service';
import { MenuID } from '../../../../../app/shared/menu/menu-id.model';
import { MenuSection } from '../../../../../app/shared/menu/menu-section.model';
// LibraOpen: override the AbstractMenuSectionComponent to use the theme text-menu-item.component
import { AbstractMenuSectionComponent } from '../../shared/menu/menu-section/abstract-menu-section.component';

/**
 * Theme NavbarSectionComponent – extends theme AbstractMenuSectionComponent
 * so the theme's menu-item.decorator map is used (theme TextMenuItemComponent, etc.).
 */
@Component({
  selector: 'ds-themed-navbar-section',
  templateUrl: '../../../../../app/navbar/navbar-section/navbar-section.component.html',
  styleUrls: ['../../../../../app/navbar/navbar-section/navbar-section.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgComponentOutlet,
  ],
})
export class NavbarSectionComponent extends AbstractMenuSectionComponent implements OnInit {
  menuID = MenuID.PUBLIC;

  constructor(
    @Inject('sectionDataProvider') protected section: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
  ) {
    super(menuService, injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
