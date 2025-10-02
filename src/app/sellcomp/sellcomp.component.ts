import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  symbol: string;
  currentPrice: number;
  availableFunds: number;
}

@Component({
  selector: 'app-sellcomp',
  templateUrl: './sellcomp.component.html',
  styleUrls: ['./sellcomp.component.css'],
})
export class SellcompComponent {
  quantity = 1;
  availableStocks: number = 0;

  cannotSell = false;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<SellcompComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  total2 = this.data.currentPrice;

  ngOnInit() {
    this.fetchAvailableStocks(this.data.symbol);
  }

  fetchAvailableStocks(symbol: string) {
    this.http
      .get<any>('https://stockapp-backend-production-673d.up.railway.app/get-available-stocks/' + symbol)
      .subscribe(
        (response) => {
          this.availableStocks = response.availableStocks;
          this.updateCannotSell();
        },
        (error) => {
          console.error('Error fetching available stocks:', error);
        }
      );
  }

  updateCannotSell() {
    this.cannotSell = this.quantity > this.availableStocks;
  }

  onQuantityChange() {
    this.total2 = this.data.currentPrice * this.quantity;
    this.updateCannotSell();
  }

  confirmSell(): void {
    if (!this.cannotSell) {
      const sellData = {
        symbol: this.data.symbol,
        quantity: this.quantity,
      };

      this.http
        .post<any>('https://stockapp-backend-production-673d.up.railway.app/sellstock', sellData)
        .subscribe(
          (response) => {
            console.log('Sell successful:', response);

            const amountEarned = response.totalEarned;

            this.http.get<any>('https://stockapp-backend-production-673d.up.railway.app/get-wallet').subscribe(
              (walletResponse) => {
                const currentAmount = walletResponse;

                const stprice = this.data.currentPrice * this.quantity;

                const updatedAmount = stprice + currentAmount;
                console.log(updatedAmount);
                console.log(stprice);
                console.log(currentAmount);

                this.http
                  .post<any>('https://stockapp-backend-production-673d.up.railway.app/update-wallet', {
                    amount: updatedAmount,
                  })
                  .subscribe(
                    (updateResponse) => {
                      console.log(
                        'Wallet amount updated successfully:',
                        updatedAmount
                      );

                      this.dialogRef.close({
                        sold: true,
                        symbol: this.data.symbol,
                      });
                    },
                    (updateError) => {
                      console.error(
                        'Error updating wallet amount:',
                        updateError
                      );
                    }
                  );
              },
              (walletError) => {
                console.error('Error fetching wallet amount:', walletError);
              }
            );
          },
          (error) => {
            console.error('Error selling:', error);
            if (error && error.error && error.error.message) {
              console.log(error.error.message);
            } else {
              console.log('An error occurred while selling.');
            }
          }
        );
    } else {
      console.log('Not enough stocks to complete the sell.');
    }
  }
}
