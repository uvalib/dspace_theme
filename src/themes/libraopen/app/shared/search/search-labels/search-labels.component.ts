import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { AppliedFilter } from 'src/app/shared/search/models/applied-filter.model';
import { SearchLabelRangeComponent } from 'src/app/shared/search/search-labels/search-label-range/search-label-range.component';

import { LibraopenSearchLabelComponent } from './search-label/search-label.component';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    LibraopenSearchLabelComponent,
    SearchLabelRangeComponent,
  ],
})
/**
 * Theme override for `ds-search-labels` which bypasses the core `SearchLabelLoaderComponent`
 * and directly renders the themed label component (including UUID→name resolution).
 */
export class SearchLabelsComponent implements OnInit {
  @Input() inPlaceSearch: boolean;

  appliedFilters$: BehaviorSubject<AppliedFilter[]>;

  constructor(
    protected searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.appliedFilters$ = this.searchService.appliedFilters$;
  }
}

