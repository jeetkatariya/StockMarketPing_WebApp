import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlist: any[] = [];
  apiUrl = 'https://stockapp-backend-production-673d.up.railway.app/check-watchlistdata';
  priceChange: any;
  percentageChange: string | number | undefined;
  datatocard: any;
  isLoading = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchWatchlist();
  }
  onCardClick(symbol: string): void {
    localStorage.setItem('searchInputValue', symbol);

    this.router.navigate(['/search', symbol]);
  }
  removeItem(company_name: string, ticker: string) {
    const url = 'https://stockapp-backend-production-673d.up.railway.app/remove-from-watchlist';
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: { company_name, ticker },
    };

    this.http.delete(url, options).subscribe({
      next: (response) => {
        console.log('Item removed:', response);
        this.watchlist = this.watchlist.filter(
          (item) => item.company_name !== company_name || item.ticker !== ticker
        );
      },
      error: (error) => {
        console.error('Error removing item:', error);
      },
    });
  }

  fetchWatchlist() {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.watchlist = response;
        this.watchlist.forEach((item) => {
          this.getStockInfo(item.ticker);
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching watchlist:', error);
        this.isLoading = false;
      },
    });
  }

  getStockInfo(ticker: string) {
    const url = `https://stockapp-backend-production-673d.up.railway.app/getSuggestions2/${ticker}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.datatocard = response;
        // console.log(this.datatocard);
        // console.log('Stock Info:', response);
        const index = this.watchlist.findIndex(
          (item) => item.ticker === ticker
        );
        if (index !== -1) {
          this.watchlist[index].stockInfo = response;
        }
      },
      error: (error) => {
        console.error('Error fetching stock info:', error);
      },
    });
  }
}
