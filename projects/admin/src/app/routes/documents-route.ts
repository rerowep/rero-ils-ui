/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { RouteInterface, RecordSearchComponent, DetailComponent } from '@rero/ng-core';
import { DocumentEditorComponent } from '../record/custom-editor/document-editor/document-editor.component';
import { DocumentsBriefViewComponent } from '../record/brief-view/documents-brief-view/documents-brief-view.component';
import { DocumentDetailViewComponent } from '../record/detail-view/document-detail-view/document-detail-view.component';
import { BaseRoute } from './Base-route';

export class DocumentsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'documents';

  /** Record type */
  readonly recordType = 'documents';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchComponent },
        { path: 'detail/:pid', component: DetailComponent },
        { path: 'edit/:pid', component: DocumentEditorComponent },
        { path: 'new', component: DocumentEditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        showSearchInput: false,
        types: [
          {
            key: this.name,
            label: 'Documents',
            editorLongMode: true,
            component: DocumentsBriefViewComponent,
            detailComponent: DocumentDetailViewComponent,
            canUpdate: (record: any) => this._routeToolService.canUpdate(record, this.recordType),
            canDelete: (record: any) => this._routeToolService.canDelete(record, this.recordType),
            preprocessRecordEditor: (record: any) => {
              return this.removeKey(record, '_text');
            },
            aggregations: (aggregations: any) => this._routeToolService
              .aggregationFilter(aggregations),
            aggregationsOrder: [
              'document_type',
              'author__fr',
              'author__en',
              'author__de',
              'author__it',
              'library',
              'organisation',
              'language',
              'subject',
              'status'
            ],
            aggregationsExpand: ['document_type'],
            aggregationsBucketSize: 10,
            itemHeaders: {
              Accept: 'application/rero+json, application/json'
            }
          }
        ]
      }
    };
  }
}
