import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { SellcompComponent } from '../sellcomp/sellcomp.component';
import { BuycompComponent } from '../buycomp/buycomp.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  stocks: any[] = [];
  availableFunds: number = 0;
  money: any;
  isLoading = false;
  dataReceived = false;
  watchlistmsg: string = '';
  color: string = '';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchWallet();
    this.fetchStockData();
  }

  fetchStockData(): void {
    console.log('Reachin');
    this.isLoading = true;
    this.http.get<any[]>('https://stockapp-backend-production-673d.up.railway.app/get-all-stock-data').subscribe(
      (response) => {
        console.log('data', response);

        if (!response || response.length === 0) {
          this.stocks = [];
          this.isLoading = false;
          this.dataReceived = true;
        }
        console.log(this.stocks);

        console.log('Reaching');

        const observables = response.map((stock) =>
          this.fetchSuggestionData(stock.symbol).pipe(
            map((suggestion) => {
              const totalCost = stock.total.toFixed(2);
              const quantity = stock.quantity.toFixed(2);
              const averageCost = totalCost / quantity;

              const currentPrice = suggestion.c;

              console.log('curr', currentPrice);
              console.log('average', averageCost);

              const change = averageCost - currentPrice;
              console.log('change', change);
              const marketValue = currentPrice * quantity;
              this.isLoading = false;
              this.dataReceived = true;

              return {
                ...stock,
                c: suggestion.c,
                dp: suggestion.dp,
                d: suggestion.d,
                totalCost,
                averageCost,
                currentPrice,
                change,
                marketValue,
              };
            })
          )
        );

        forkJoin(observables).subscribe(
          (mergedStocks) => {
            this.stocks = mergedStocks;
            this.isLoading = false;
            this.dataReceived = true;
            console.log('Portfolio dataaa');
            console.log('Portfolio dataaa', this.stocks);
          },
          (error) => {
            console.error('Error fetching suggestion data:', error);
            // this.isLoading = false;
            // this.dataReceived=true;
          }
        );
      },
      (error) => console.error('Error fetching stock data:', error)
    );
  }

  fetchSuggestionData(ticker: string) {
    return this.http.get<any>(
      `https://stockapp-backend-production-673d.up.railway.app/getSuggestions2/${ticker}`
    );
  }

  fetchWallet(): void {
    this.http
      .get<{ money: number }>('https://stockapp-backend-production-673d.up.railway.app/get-wallet')
      .subscribe({
        next: (response) => {
          console.log('Wallet money:', response);
          this.money = response;
          // this.isLoading = false;
          // this.dataReceived=true;
        },
        error: (error) => console.error('There was an error!', error),
      });
    // this.isLoading = false;
  }

  openModalbuy(
    symbol2: string,
    currentPrice: number,
    availableFunds: number,
    companyname: string
  ): void {
    const dialogRef = this.dialog.open(BuycompComponent, {
      width: '250px',
      position: { top: '100px' },
      data: {
        symbol: symbol2,
        currentPrice: currentPrice,
        availableFunds: availableFunds,
        companyname: companyname,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.bought) {
        this.watchlistmsg = `${result.symbol} Bought succesfully`;
        this.color = 'alert-success';

        console.log('The dialog was closed', result);
        this.fetchStockData();
        this.fetchWallet();
        setTimeout(() => {
          this.watchlistmsg = '';
        }, 3000);
      }
    });
  }

  openModalsell(
    symbol2: string,
    currentprice: number,
    availablefunds: number
  ): void {
    const dialogRef = this.dialog.open(SellcompComponent, {
      width: '250px',
      position: { top: '100px' },
      data: {
        symbol: symbol2,
        currentPrice: currentprice,
        availableFunds: availablefunds,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.sold) {
        this.watchlistmsg = `${result.symbol} sold succesfully`;
        this.color = 'alert-danger';
        console.log('The dialog was closed', result);
        this.fetchStockData();
        this.fetchWallet();
        setTimeout(() => {
          this.watchlistmsg = '';
        }, 3000);
      }
    });
  }
}
