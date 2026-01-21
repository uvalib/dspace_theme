import { ChangeDetectionStrategy } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Params,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from 'src/app/core/data/dspace-object-data.service';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { SearchConfigurationService } from 'src/app/core/shared/search/search-configuration.service';
import { SearchFilterService } from 'src/app/core/shared/search/search-filter.service';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { ActivatedRouteStub } from 'src/app/shared/testing/active-router.stub';
import { PaginationServiceStub } from 'src/app/shared/testing/pagination-service.stub';
import { SearchConfigurationServiceStub } from 'src/app/shared/testing/search-configuration-service.stub';
import { SearchFilterServiceStub } from 'src/app/shared/testing/search-filter-service.stub';
import { SearchServiceStub } from 'src/app/shared/testing/search-service.stub';
import { ObjectKeysPipe } from 'src/app/shared/utils/object-keys-pipe';
import { AppliedFilter } from 'src/app/shared/search/models/applied-filter.model';
import { addOperatorToFilterValue } from 'src/app/shared/search/search.utils';
import { LibraopenSearchLabelComponent } from './search-label.component';

describe('LibraopenSearchLabelComponent', () => {
  let comp: LibraopenSearchLabelComponent;
  let fixture: ComponentFixture<LibraopenSearchLabelComponent>;

  let route: ActivatedRouteStub;
  let searchConfigurationService: SearchConfigurationServiceStub;
  let searchFilterService: SearchFilterServiceStub;
  let paginationService: PaginationServiceStub;

  const searchLink = '/search';
  let appliedFilter: AppliedFilter;
  let initialRouteParams: Params;
  let pagination: PaginationComponentOptions;
  let dspaceObjectDataService: { findById: jasmine.Spy };
  let dsoNameService: { getName: jasmine.Spy };

  function init(): void {
    appliedFilter = Object.assign(new AppliedFilter(), {
      filter: 'author',
      operator: 'authority',
      value: '1282121b-5394-4689-ab93-78d537764052',
      label: 'Odinson, Thor',
    });
    initialRouteParams = {
      'query': '',
      'spc.page': '1',
      'f.author': addOperatorToFilterValue(appliedFilter.value, appliedFilter.operator),
      'f.has_content_in_original_bundle': addOperatorToFilterValue('true', 'equals'),
    };
    pagination = Object.assign(new PaginationComponentOptions(), {
      id: 'page-id',
      currentPage: 1,
      pageSize: 20,
    });

    dspaceObjectDataService = {
      findById: jasmine.createSpy('findById').and.returnValue(of()),
    };

    dsoNameService = {
      getName: jasmine.createSpy('getName').and.returnValue(undefined),
    };
  }

  beforeEach(waitForAsync(async () => {
    init();
    route = new ActivatedRouteStub(initialRouteParams);
    searchConfigurationService = new SearchConfigurationServiceStub();
    searchFilterService = new SearchFilterServiceStub();
    paginationService = new PaginationServiceStub(pagination);

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NoopAnimationsModule,
        FormsModule,
        ObjectKeysPipe,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: DSpaceObjectDataService, useValue: dspaceObjectDataService },
        { provide: DSONameService, useValue: dsoNameService },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).overrideComponent(LibraopenSearchLabelComponent, {
      remove: {
        imports: [RouterLink],
      },
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraopenSearchLabelComponent);
    comp = fixture.componentInstance;
    comp.appliedFilter = appliedFilter;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should resolve UUID labels to the DSpace object name', waitForAsync(async () => {
    const uuid = '64346c2d-a58f-4da1-9f8b-a5aa92c4826a';
    dsoNameService.getName.and.returnValue('Jane Doe');
    dspaceObjectDataService.findById.and.returnValue(
      createSuccessfulRemoteDataObject$({} as any),
    );

    fixture.componentRef.setInput('appliedFilter', Object.assign(new AppliedFilter(), {
      filter: 'isAuthorOfPublication',
      operator: 'equals',
      value: uuid,
      label: uuid,
    }));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Jane Doe');
    expect(text).not.toContain(uuid);
  }));
});

