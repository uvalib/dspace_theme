import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SearchNavbarComponent as BaseComponent } from '../../../../app/search-navbar/search-navbar.component';
import { expandSearchInput } from '../shared/animations/slide';
import { BrowserOnlyPipe } from '../../../../app/shared/utils/browser-only.pipe';
import { ClickOutsideDirective } from '../../../../app/shared/utils/click-outside.directive';

@Component({
  selector: 'ds-themed-search-navbar',
  styleUrls: ['./search-navbar.component.scss'],
  //styleUrls: ['../../../../app/search-navbar/search-navbar.component.scss'],
  // templateUrl: './search-navbar.component.html'
  templateUrl: './search-navbar.component.html',
  animations: [expandSearchInput],
  standalone: true,
  imports: [
    CommonModule,
    BrowserOnlyPipe,
    ClickOutsideDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class SearchNavbarComponent extends BaseComponent {
}
