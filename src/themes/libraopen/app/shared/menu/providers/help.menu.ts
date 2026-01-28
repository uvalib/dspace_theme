import { Injectable } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';

import { ExternalLinkMenuItemModel } from '../../../../../../app/shared/menu/menu-item/models/external-link.model';
import { TextMenuItemModel } from '../../../../../../app/shared/menu/menu-item/models/text.model';
import { MenuItemType } from '../../../../../../app/shared/menu/menu-item-type.model';
import { PartialMenuSection } from '../../../../../../app/shared/menu/menu-provider.model';
import { AbstractExpandableMenuProvider } from '../../../../../../app/shared/menu/providers/helper-providers/expandable-menu-provider';

/**
 * LibraOpen theme: "Help" menu section in the public navbar
 */
@Injectable()
export class HelpMenuProvider extends AbstractExpandableMenuProvider {
  getTopSection(): Observable<PartialMenuSection> {
    return of({
      model: {
        type: MenuItemType.TEXT,
        text: 'menu.section.help',
      } as TextMenuItemModel,
      visible: true,
    });
  }

  getSubSections(): Observable<PartialMenuSection[]> {
    return of([
      {
        visible: true,
        model: {
          type: MenuItemType.EXTERNAL,
          text: 'menu.section.help_deposit_checklist',
          href: 'https://library.virginia.edu/libra/open/oc-checklist',
        } as ExternalLinkMenuItemModel,
      },
      {
        visible: true,
        model: {
          type: MenuItemType.EXTERNAL,
          text: 'menu.section.help_about_libraopen',
          href: 'https://library.virginia.edu/libra/open',
        } as ExternalLinkMenuItemModel,
      },
      {
        visible: true,
        model: {
          type: MenuItemType.EXTERNAL,
          text: 'menu.section.help_support',
          href: 'mailto:libra@virginia.edu',
        } as ExternalLinkMenuItemModel,
      },
    ]);
  }
}

