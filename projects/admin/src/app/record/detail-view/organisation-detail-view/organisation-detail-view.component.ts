/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { Component } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'admin-organisation-detail-view',
  templateUrl: './organisation-detail-view.component.html'
})
export class OrganisationDetailViewComponent implements DetailRecord {

  /**
   * Record observable
   */
  record$: Observable<any>;

  /**
   * Type
   */
  type: string;

  get isSystemLibrarian() {
    return this._userService.hasRole('system_librarian');

  }

  constructor(private _userService: UserService) {}
}
