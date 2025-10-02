import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  symbol: string;
  currentPrice: number;
  availableFunds: number;
  companyname: string;
}
@Component({
  selector: 'app-buycomp',
  templateUrl: './buycomp.component.html',
  styleUrls: ['./buycomp.component.css'],
})
export class BuycompComponent {
  quantity = 1;
  cannotBuy = false;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<BuycompComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.updateTotal();
  }

  get total() {
    return this.quantity * this.data.currentPrice;
  }

  updateTotal() {
    this.cannotBuy = this.total > this.data.availableFunds;
  }

  onQuantityChange() {
    this.updateTotal();
  }

  confirmPurchase(): void {
    if (!this.cannotBuy) {
      const purchaseData = {
        symbol: this.data.symbol,
        quantity: this.quantity,
        total: this.total,
        name: this.data.companyname,
      };

      this.http
        .post<any>('https://stockapp-backend-production-673d.up.railway.app/purchasestock', purchaseData)
        .subscribe({
          next: (response) => {
            console.log('Purchase successful:', response);

            this.data.availableFunds -= this.total;

            this.updateWallet(this.data.availableFunds);

            this.dialogRef.close({ bought: true, symbol: this.data.symbol });
          },
          error: (error) => {
            console.error('Error purchasing:', error);
          },
        });
    } else {
      console.log('Not enough funds to complete the purchase.');
    }
  }

  updateWallet(newAmount: number): void {
    this.http
      .post<any>('https://stockapp-backend-production-673d.up.railway.app/update-wallet', { amount: newAmount })
      .subscribe({
        next: (response) =>
          console.log('Wallet updated successfully:', response),
        error: (error) => console.error('Error updating wallet:', error),
      });
  }
}
