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
import { RouteInterface, EditorComponent, extractIdOnRef } from '@rero/ng-core';
import { BaseRoute } from './Base-route';
import { of } from 'rxjs';

export class AcquisitionAccountsRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'acq_accounts';

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: 'edit/:pid', component: EditorComponent },
        { path: 'new', component: EditorComponent }
      ],
      data: {
        linkPrefix: 'records',
        types: [
          {
            key: this.name,
            label: 'Acquisition accounts',
            preCreateRecord: (data: any) => {
              const user = this._routeToolService.userService.getCurrentUser();
              data.organisation = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'organisations', user.library.organisation.pid
                )
              };
              data.library = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'libraries', user.currentLibrary
                )
              };
              data.budget = {
                $ref: this._routeToolService.apiService.getRefEndpoint(
                  'budgets', this._routeToolService.getRouteQueryParam('budget')
                )
              };
              return data;
            },
            redirectUrl: (record: any) => {
              const budgetPid = extractIdOnRef(record.metadata.budget.$ref);
              return of(`records/budgets/detail/${budgetPid}`);
            }
          }
        ]
      }
    };
  }
}
