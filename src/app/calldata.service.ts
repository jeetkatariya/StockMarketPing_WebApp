import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalldataService {
  private baseURL = 'https://stockapp-backend-production-673d.up.railway.app';

  constructor(private http: HttpClient) {}

  getSuggestions(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/getSuggestions/${ticker}`);
  }

  getAutocomplete(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/autocomplete/${ticker}`);
  }

  getNews(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/news/${ticker}`);
  }

  getCompanyPeers(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/companypeers/${ticker}`);
  }

  getRecommendations(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/recommend/${ticker}`);
  }

  getEarnings(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/earning/${ticker}`);
  }

  getStockChart(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/stock-chart/${ticker}`);
  }

  getLastDay(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/lastday/${ticker}`);
  }

  getInsights(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/insights/${ticker}`);
  }

  getSuggestions2(ticker: string): Observable<any> {
    return this.http.get(`${this.baseURL}/getSuggestions2/${ticker}`);
  }
}
