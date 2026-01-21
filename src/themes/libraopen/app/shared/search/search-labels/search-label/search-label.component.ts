import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Params,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  startWith,
} from 'rxjs/operators';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from 'src/app/core/data/dspace-object-data.service';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { SearchConfigurationService } from 'src/app/core/shared/search/search-configuration.service';
import { SearchFilterService } from 'src/app/core/shared/search/search-filter.service';
import { hasValue } from 'src/app/shared/empty.util';
import { AppliedFilter } from 'src/app/shared/search/models/applied-filter.model';
import { currentPath } from 'src/app/shared/utils/route.utils';

/**
 * Theme override for `ds-search-label` that resolves UUID labels (e.g. entity relationship filters)
 * to a human-friendly DSpace object name via `/api/core/dso?uuid=...`.
 */
@Component({
  selector: 'ds-search-label',
  templateUrl: './search-label.component.html',
  styleUrls: ['./search-label.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class LibraopenSearchLabelComponent implements OnInit, OnChanges {
  @Input() inPlaceSearch: boolean;
  @Input() appliedFilter: AppliedFilter;

  searchLink: string;
  removeParameters$: Observable<Params>;

  resolvedLabel$: Observable<string>;
  isUuidLabel = false;

  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchService: SearchService,
    protected searchFilterService: SearchFilterService,
    protected dspaceObjectDataService: DSpaceObjectDataService,
    protected dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.removeParameters$ = this.updateRemoveParams();
    this.isUuidLabel = this.shouldResolveUuidLabel(this.appliedFilter?.label);
    this.resolvedLabel$ = this.getResolvedLabel$();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasValue(changes.appliedFilter)) {
      this.removeParameters$ = this.updateRemoveParams();
      this.isUuidLabel = this.shouldResolveUuidLabel(this.appliedFilter?.label);
      this.resolvedLabel$ = this.getResolvedLabel$();
    }
  }

  updateRemoveParams(): Observable<Params> {
    return this.searchConfigurationService.unselectAppliedFilterParams(
      this.appliedFilter.filter,
      this.appliedFilter.value,
      this.appliedFilter.operator,
    );
  }
  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  private getResolvedLabel$(): Observable<string> {
    const rawLabel = this.appliedFilter?.label;

    if (!hasValue(rawLabel)) {
      return of(rawLabel);
    }

    if (!this.shouldResolveUuidLabel(rawLabel)) {
      return of(rawLabel);
    }

    return this.dspaceObjectDataService.findById(rawLabel).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((dso) => {
        if (!hasValue(dso)) {
          return rawLabel;
        }
        const name = this.dsoNameService.getName(dso);
        return hasValue(name) ? name : rawLabel;
      }),
      catchError(() => of(rawLabel)),
      // Ensure the UI always has something to display while the request resolves
      startWith(rawLabel),
    );
  }

  private shouldResolveUuidLabel(value: string): boolean {
    if (!hasValue(value)) {
      return false;
    }
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }
}

