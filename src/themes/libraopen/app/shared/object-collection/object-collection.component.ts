import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';

import { ObjectCollectionComponent as BaseComponent } from '../../../../../app/shared/object-collection/object-collection.component';
import { ObjectDetailComponent } from '../../../../../app/shared/object-detail/object-detail.component';
import { ObjectGeospatialMapComponent } from '../../../../../app/shared/object-geospatial-map/object-geospatial-map.component';
import { ObjectGridComponent } from '../../../../../app/shared/object-grid/object-grid.component';
import { ThemedObjectListComponent } from '../../../../../app/shared/object-list/themed-object-list.component';
import { ObjectTableComponent } from '../../../../../app/shared/object-table/object-table.component';

@Component({
  selector: 'ds-themed-object-collection',
  styleUrls: ['../../../../../app/shared/object-collection/object-collection.component.scss'],
  templateUrl: './object-collection.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ObjectDetailComponent,
    ObjectGeospatialMapComponent,
    ObjectGridComponent,
    ObjectTableComponent,
    ThemedObjectListComponent,
  ],
})
export class ObjectCollectionComponent extends BaseComponent {
}
