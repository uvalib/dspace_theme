import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExternalLinkMenuItemComponent as BaseComponent } from '../../../../../../app/shared/menu/menu-item/external-link-menu-item.component';

@Component({
  selector: 'ds-external-link-menu-item',
  styleUrls: ['../../../../../../app/shared/menu/menu-item/menu-item.component.scss'],
  templateUrl: './external-link-menu-item.component.html',
  standalone: true,
  imports: [NgClass, RouterLinkActive, TranslateModule],
})
export class ExternalLinkMenuItemComponent extends BaseComponent {
}
