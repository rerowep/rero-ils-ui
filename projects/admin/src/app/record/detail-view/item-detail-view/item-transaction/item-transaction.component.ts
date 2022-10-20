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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { LoanState } from '@app/admin/classes/loans';
import { ItemsService } from '@app/admin/service/items.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-item-transaction',
  templateUrl: './item-transaction.component.html'
})
export class ItemTransactionComponent implements OnInit, OnDestroy {

  // COMPONENTS ATTRIBUTES ===============================================================
  /** Loan Record */
  @Input() transaction: any;
  /** Ressource type */
  @Input() type: string;
  /** Flag for cell background */
  @Input() background: boolean;
  /** Item pid */
  @Input() itemPid: string;
  /** Informs parent component to remove request when it is cancelled */
  @Output() cancelRequestEvent = new EventEmitter<any>();
  /** Informs parent component to update pickup location */
  @Output() updatePickupLocationEvent = new EventEmitter<any>();

  /** Pickup locations of the organisation */
  pickupLocations: any;

  /** Pickup default $ref */
  private _pickupDefaultValue: string;
  /** Current user */
  private _currentUser: any;
  /** Pickup locations observable reference */
  private _pickupLocations$: any;
  /** Authorized Transaction Type to load pickup locations */
  private _autorizedTypeToLoadPickupLocations = [
    'loan_request'
  ];

  // GETTER & SETTER ======================================================================
  /**
   * Get current pickup location
   * @return pickup location name
   */
  get currentPickupLocation(): string {
    const location = this.pickupLocations.find(loc => loc.value === this.transaction.metadata.pickup_location_pid);
    if (location != null) {
      return location.label;
    }
    return this._translateService.instant('No pickup location');
  }


  // CONSTRUCTOR & HOOKS ==================================================================
  /**
   * constructor
   * @param _userService - User service
   * @param _translateService - TranslateService
   * @param _dialogService: DialogService
   * @param _itemService: ItemsService
   */
  constructor(
    private _userService: UserService,
    private _translateService: TranslateService,
    private _dialogService: DialogService,
    private _itemService: ItemsService
  ) {}

  /** OnInit hook */
  ngOnInit() {
    this._currentUser = this._userService.user;
    if (this._autorizedTypeToLoadPickupLocations.includes(this.type)) {
      this._pickupLocations$ = this.getPickupLocations().subscribe((pickups) => {
        this.pickupLocations = pickups;
      });
    }
  }

  /** OnDestroy hook */
  ngOnDestroy() {
    if (this._autorizedTypeToLoadPickupLocations.includes(this.type)) {
      this._pickupLocations$.unsubscribe();
    }
  }


  // COMPONENT FUNCTIONS ==================================================================
  /** Check if request can be cancelled. */
  canCancelRequest(): boolean {
    // No permission API in backend
    // Allowed when loan state is PENDING or ITEM_IN_TRANSIT_FOR_PICKUP according to actions.md
    const itemStatus = [LoanState.PENDING, LoanState.ITEM_IN_TRANSIT_FOR_PICKUP, LoanState.ITEM_AT_DESK];
    return itemStatus.some((element) => element === this.transaction.metadata.state);

  }

  /** Check if request pickup location can be changed. */
  canUpdateRequestPickupLocation(): boolean {
    // No permission API in backend
    // Allowed when loan state is PENDING or ITEM_IN_TRANSIT_FOR_PICKUP according to actions.md
    const itemStatus = [LoanState.PENDING, LoanState.ITEM_IN_TRANSIT_FOR_PICKUP];
    return itemStatus.some((element) => element === this.transaction.metadata.state);
  }

  /** Show a confirmation dialog box for cancel request. */
  showCancelRequestDialog(): void {
    const config = {
      ignoreBackdropClick: true,
      initialState: {
        title: this._translateService.instant('Cancel request'),
        body: this._translateService.instant('Do you really want to delete this request?'),
        confirmButton: true,
        cancelTitleButton: this._translateService.instant('No'),
        confirmTitleButton: this._translateService.instant('Yes')
      }
    };
    this._dialogService.show(config).subscribe((confirm: boolean) => {
      if (confirm) {
        this.emitCancelRequest();
      }
    });
  }

  /** Inform parent to cancel the request. */
  emitCancelRequest(): void {
    this.cancelRequestEvent.emit(this.transaction);
  }

  /** Inform parent to cancel the request. */
  emitUpdatePickupLocation(pickupLocationPid: string): void {
    const data = {
      pickupLocationPid,
      transaction: this.transaction
    };
    this.updatePickupLocationEvent.emit(data);
  }

  /** Get pickups by organisation pid */
  private getPickupLocations(): Observable<{label: string, value: string}> {
    const currentLibrary = this._currentUser.currentLibrary;
    return this._itemService.getPickupLocations(this.itemPid).pipe(
        map(locations => locations.map((loc: any) => {
          if (this._pickupDefaultValue === undefined && loc.library.pid === currentLibrary) {
            this._pickupDefaultValue = loc.pid;
          }
          return {
            label: loc.pickup_name || loc.name,
            value: loc.pid
          };
        }))
    );
  }
}
