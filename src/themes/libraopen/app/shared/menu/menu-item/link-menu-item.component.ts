import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LinkMenuItemComponent as BaseComponent } from '../../../../../../app/shared/menu/menu-item/link-menu-item.component';

@Component({
  selector: 'ds-link-menu-item',
  styleUrls: ['../../../../../../app/shared/menu/menu-item/menu-item.component.scss'],
  templateUrl: './link-menu-item.component.html',
  standalone: true,
  imports: [NgClass, RouterLink, TranslateModule],
})
export class LinkMenuItemComponent extends BaseComponent {
}
