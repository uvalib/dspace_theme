import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

import { Item } from '../../../../../../../../app/core/shared/item.model';
import { MetadataValue } from '../../../../../../../../app/core/shared/metadata.models';
import { MetadataFieldWrapperComponent } from '../../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { OrcidBadgeAndTooltipComponent } from '../../../../../../../../app/shared/orcid-badge-and-tooltip/orcid-badge-and-tooltip.component';

@Component({
  selector: 'ds-orcid-item-page-field',
  templateUrl: './orcid-item-page-field.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MetadataFieldWrapperComponent,
    OrcidBadgeAndTooltipComponent,
    TranslateModule,
  ],
})
export class OrcidItemPageFieldComponent {
  @Input() item: Item;

  /** Label i18n key */
  @Input() label: string;

  /** Separator HTML between multiple values */
  @Input() separator = '<br/>';

  // Cast to any because `orcid` is a local UI config extension (not part of upstream AppConfig type).
  get orcidBaseUrl(): string {
    const base = ((environment as any)?.orcid?.baseUrl ?? 'https://orcid.org') as string;
    return base.replace(/\/+$/, '');
  }

  get orcidValues(): MetadataValue[] {
    return this.item?.allMetadata('person.identifier.orcid') ?? [];
  }
}

