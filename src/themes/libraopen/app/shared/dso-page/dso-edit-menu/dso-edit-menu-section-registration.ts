import { MenuID } from '../../../../../../app/shared/menu/menu-id.model';
import { rendersSectionForMenu } from '../../../../../../app/shared/menu/menu-section.decorator';
import { DsoEditMenuExpandableSectionComponent } from './dso-edit-expandable-menu-section/dso-edit-menu-expandable-section.component';

/** Register LibraOpen DSO edit expandable section for theme 'libraopen'. */
rendersSectionForMenu(MenuID.DSO_EDIT, true, 'libraopen')(DsoEditMenuExpandableSectionComponent);
