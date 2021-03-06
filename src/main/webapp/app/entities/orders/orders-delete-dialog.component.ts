import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrders } from 'app/shared/model/orders.model';
import { OrdersService } from './orders.service';

@Component({
  selector: 'jhi-orders-delete-dialog',
  templateUrl: './orders-delete-dialog.component.html'
})
export class OrdersDeleteDialogComponent {
  orders: IOrders;

  constructor(protected ordersService: OrdersService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.ordersService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'ordersListModification',
        content: 'Deleted an orders'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-orders-delete-popup',
  template: ''
})
export class OrdersDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ orders }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OrdersDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.orders = orders;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/orders', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/orders', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
