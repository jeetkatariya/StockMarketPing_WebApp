import {
  NgZone,
  ChangeDetectorRef,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Optional,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts/highstock';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewscontentComponent } from '../newscontent/newscontent.component';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { SeriesOptionsType } from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import HC_stock from 'highcharts/modules/stock';
import IndicatorsAll from 'highcharts/indicators/indicators-all';
import Exporting from 'highcharts/modules/exporting';
import { FormControl } from '@angular/forms';
import { Observable, interval, of, tap, timer } from 'rxjs';

import { DataserviceComponent } from '../dataservice/dataservice.component';
import { StatesaveService } from '../statesave.service';
import { BuycompComponent } from '../buycomp/buycomp.component';
import { SellcompComponent } from '../sellcomp/sellcomp.component';
import { CalldataService } from '../calldata.service';
import volymeByPrice from 'highcharts/indicators/volume-by-price';
import volumeByPrice from 'highcharts/indicators/volume-by-price';
import HighchartsStock from 'highcharts/modules/stock';
import indicators from 'highcharts/indicators/indicators';
import HighChartsExporting from 'highcharts/modules/exporting';

// HC_stock(Highcharts);
// IndicatorsAll(Highcharts);
// HC_exporting(Highcharts);
// Exporting(Highcharts);

indicators(Highcharts);
volumeByPrice(Highcharts);
HighChartsExporting(Highcharts);
HighchartsStock(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loadedstockdata = false;
  isLoading = false;
  stockLoading = false;
  stockData: any[] = [];
  displaySellButton: boolean = false;

  myControl = new FormControl();
  filteredOptions!: Observable<any[]>;
  loading: boolean = true;

  inputIsEmpty: boolean = false;
  cannotSell = false;
  cursonloading = false;

  @ViewChild('searchInput') searchInput: any;
  Highcharts: typeof Highcharts = Highcharts;
  Highcharts2: typeof Highcharts = Highcharts;
  Highcharts3: typeof Highcharts = Highcharts;
  Highcharts4: any;
  demochart!: Highcharts.Options;
  tab1char!: Highcharts.Options;
  recommendchart!: Highcharts.Options;
  charttab: any;
  mychart!: Highcharts.Options;
  staticchart!: Highcharts.Options;

  watchlistmsg: string = '';
  color: string = '';
  purchasemsg: string = '';

  searchResult: any;
  searchResult2: any;
  companypeers: any;
  news: any;
  insights: any;
  recommend: any;
  earning: any;
  earningsChart: any;
  stdchart: any;
  sumtabchrt: any;
  autocmp: any;

  showSearchResult: boolean = false;
  suggestions: string[] = [];
  searchInitiated: boolean = false;
  marketStatus: string = '';
  marketStatusColor: string = '';
  lastCloseTimeString: string = '';
  activeTab: string = 'summary';
  isStarred: boolean = false;
  storedSearchInput: string = '';
  newsup: any[] = [];
  selectedNewsItem: any = null;
  isModalOpen: boolean = false;
  currentDateTime: string = '';

  totalMspR: number = 0;
  positiveMspR: number = 0;
  negativeMspR: number = 0;
  totalChange: number = 0;
  positiveChange: number = 0;
  negativeChange: number = 0;
  errorMessage: any;
  isFilled: boolean = false;
  showSuccess: boolean = false;
  showDanger: boolean = false;

  isStockInPortfolio: boolean = false;

  stockSymbols: Set<string> = new Set();
  portfolioData: any;

  data: any;

  constructor(
    @Optional() public dialogRef: MatDialogRef<HomeComponent>,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private stateManagementService: StatesaveService,
    private calldataService: CalldataService
  ) {}

  ngOnInit() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);

    interval(15000).subscribe(() => {
      this.currentDateTime = `${new Date().getFullYear()}-${(
        new Date().getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${new Date()
        .getDate()
        .toString()
        .padStart(2, '0')} ${new Date()
        .getHours()
        .toString()
        .padStart(2, '0')}:${new Date()
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${new Date()
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
    });

    this.currentDateTime = `${new Date().getFullYear()}-${(
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${new Date()
      .getDate()
      .toString()
      .padStart(2, '0')} ${new Date()
      .getHours()
      .toString()
      .padStart(2, '0')}:${new Date()
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${new Date()
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;

    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
          this.getMinimalData(this.storedSearchInput);
        });
      }, 15000);
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      tap(() => {
        this.cursonloading = true;
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        return this._filter(value);
      }),
      tap(() => {
        this.cursonloading = false;
      }),
      finalize(() => {
        this.cursonloading = false;
      })
    );

    console.log('Router home: ', this.router.url);
    const storedValue = localStorage.getItem('searchInputValue');
    // this.getAllStockData();

    if (storedValue) {
      this.storedSearchInput = storedValue;
      try {
        this.getMethod(storedValue);

        //  this.sumtab(this.sumtabchrt);
        //  this.mystockchart(this.stdchart);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }
    console.log('Hellllo');
  }
  handleBeforeUnload(_handleBeforeUnload: any) {
    localStorage.setItem('lastVisited', '/search/home');
  }

  getAllStockData() {
    this.http.get<any[]>('https://stockapp-backend-production-673d.up.railway.app/get-all-stock-data').subscribe({
      next: (data) => {
        this.stockData = data;
        this.updateDisplaySellButton();
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  updateDisplaySellButton() {
    this.displaySellButton = this.stockData.some(
      (stock) =>
        stock.symbol.toUpperCase() ===
        this.storedSearchInput.toUpperCase().trim()
    );
    this.cdRef.detectChanges();
  }

  onSearchInputUpdate(newInput: string) {
    this.storedSearchInput = newInput;
    this.updateDisplaySellButton();
  }

  async toggleFill() {
    const companyName = this.searchResult?.name;
    const ticker = this.searchResult?.ticker;

    if (!companyName || !ticker) {
      console.error('Company name or ticker is missing.');
      return;
    }

    console.log('Checking and toggling watchlist status...');

    try {
      const response = await this.http
        .get<{ exists?: boolean }>(
          `https://stockapp-backend-production-673d.up.railway.app/check-watchlist?company_name=${encodeURIComponent(
            companyName
          )}&ticker=${encodeURIComponent(ticker)}`
        )
        .toPromise();

      const exists = response?.exists ?? false;

      if (!exists) {
        await this.http
          .post(
            `https://stockapp-backend-production-673d.up.railway.app/add-to-watchlist`,
            { company_name: companyName, ticker: ticker },
            { responseType: 'text' }
          )
          .toPromise();
        this.isFilled = true;

        this.showSuccess = true;
        this.showDanger = false;
        console.log('Added to watchlist, status now filled.');
      } else {
        await this.http
          .request('delete', `https://stockapp-backend-production-673d.up.railway.app/remove-from-watchlist`, {
            body: { company_name: companyName, ticker: ticker },
            responseType: 'text',
          })
          .toPromise();
        this.isFilled = false;
        console.log('Removed from watchlist, status now not filled.');
        this.showSuccess = false;
        this.showDanger = true;
      }
      timer(3000).subscribe(() => {
        this.showSuccess = false;
        this.showDanger = false;
      });
    } catch (error) {
      console.error('Error processing watchlist action:', error);
    }
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  private _filter(value: string): Observable<any[]> {
    if (!value || value.length < 1) {
      return of([]);
    }

    const autocmpUrl = `https://stockapp-backend-production-673d.up.railway.app/autocomplete/${value}`;

    return this.http.get<{ result: any[] }>(autocmpUrl).pipe(
      map((response) => {
        const filteredResults = response.result.filter(
          (item) => item.type === 'Common Stock'
        );
        return filteredResults || [];
      }),
      catchError(() => of([]))
    );
  }

  isMarketOpen() {
    const lastTimestampInSeconds = this.searchResult2?.t;
    if (!lastTimestampInSeconds) return false;

    const lastTimestampInMilliseconds = lastTimestampInSeconds * 1000;
    const elapsedMilliseconds = Date.now() - lastTimestampInMilliseconds;
    const elapsedMinutes = elapsedMilliseconds / (1000 * 60);
    const marketOpenThreshold = 5;

    return elapsedMinutes <= marketOpenThreshold;
  }

  getMinimalData(input: string): void {
    if (!this.isMarketOpen()) {
      // console.log("Market is Closed");
      return;
    }
    const apiUrl = `https://stockapp-backend-production-673d.up.railway.app/getSuggestions2/${input}`;
    this.http.get<any>(apiUrl).subscribe((data) => {
      if (data) {
        this.searchResult2.c = Number(data.c).toFixed(2);
        this.searchResult2.d = Number(data.d).toFixed(2);
        const timestamp = data.t * 1000;
      }
    });
  }
  // checkempty():void{
  //   if (!this.searchInput.nativeElement.value.trim()) {

  //     this.errorMessage = "Please enter a valid ticker.";
  //     return ;
  //   }
  // }

  getPortfolioData() {
    this.http.get<any[]>('https://stockapp-backend-production-673d.up.railway.app/get-all-stock-data').subscribe({
      next: (data) => {
        this.portfolioData = data;
        console.log('Wallet data:', this.portfolioData);
      },
      error: (error) => {
        console.error('Error fetching wallet data:', error);
        console.error('Error status:', error.status);
        console.error('Error detail:', error.message);
      },
    });
  }

  containsTicker(ticker: string): boolean {
    return this.portfolioData.some(
      (item: { symbol: string }) => item.symbol === ticker
    );
  }

  async getMethod(str: string, event?: Event): Promise<void> {
    if (!str.trim()) {
      this.cancelMethod();
      this.errorMessage = 'Please enter a valid ticker.';
      this.router.navigate(['/search/home']);
      return;
    }

    if (event) {
      event.preventDefault();
    }

    this.errorMessage = '';
    this.storedSearchInput = str.toUpperCase();
    localStorage.setItem('searchInputValue', str);

    this.stockLoading = true;
    this.errorMessage = '';
    this.loadedstockdata = false;

    const apiConfigs = [
      {
        url: `https://stockapp-backend-production-673d.up.railway.app/getSuggestions/${str}`,
        cacheKey: `suggestions_${str}`,
      },
      {
        url: `https://stockapp-backend-production-673d.up.railway.app/getSuggestions2/${str}`,
        cacheKey: `suggestions2_${str}`,
      },
      {
        url: `https://stockapp-backend-production-673d.up.railway.app/companypeers/${str}`,
        cacheKey: `companypeers_${str}`,
      },
      { url: `https://stockapp-backend-production-673d.up.railway.app/news/${str}`, cacheKey: `news_${str}` },
      {
        url: `https://stockapp-backend-production-673d.up.railway.app/insights/${str}`,
        cacheKey: `insights_${str}`,
      },
      {
        url: `https://stockapp-backend-production-673d.up.railway.app/recommend/${str}`,
        cacheKey: `recommend_${str}`,
      },
      {
        url: `https://stockapp-backend-production-673d.up.railway.app/earning/${str}`,
        cacheKey: `earnings_${str}`,
      },
      {
        url: `https://stockapp-backend-production-673d.up.railway.app/stock-chart/${str}`,
        cacheKey: `stdchart_${str}`,
      },
      {
        url: `https://stockapp-backend-production-673d.up.railway.app/lastday/${str}`,
        cacheKey: `sumtabchrt_${str}`,
      },
    ];

    try {
      for (const config of apiConfigs) {
        const data = await this.loadData(config.url, config.cacheKey);

        this.assignDataToProperty(config.cacheKey, data);
        this.stockLoading = false;
        this.checkIfInWatchlist();
        this.getAllStockData();

        // this.myhighchart();

        this.stockLoading = false;
      }

      // this.checkIfInWatchlist();
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
    }
  }

  private async loadData(url: string, cacheKey: string): Promise<any> {
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      const response = await this.http.get<any>(url).toPromise();
      localStorage.setItem(cacheKey, JSON.stringify(response));
      return response;
    }
  }

  private assignDataToProperty(cacheKey: string, data: any): void {
    if (cacheKey.includes('suggestions_')) {
      this.searchResult = data;
      if (this.searchResult.ticker !== this.storedSearchInput) {
        this.errorMessage = 'No data found! Please enter a valid ticker';
        this.router.navigate(['/search/home']);
        return;
      }
      this.router.navigate(['/search', this.storedSearchInput]);
      console.log('log1 sug');
    } else if (cacheKey.includes('suggestions2_')) {
      this.searchResult2 = data;
      this.setMarketStatus();
      console.log('log1 sug2');
    } else if (cacheKey.includes('companypeers_')) {
      this.companypeers = data;
      console.log('log1 compeer', this.companypeers);
    } else if (cacheKey.includes('news_')) {
      this.news = data.slice(0, 20);
      console.log('log1 news');
    } else if (cacheKey.includes('insights_')) {
      this.insights = data;
      console.log(this.insights, 'log1 insight');
      this.calculateSentiments(this.insights);
    } else if (cacheKey.includes('recommend_')) {
      this.recommend = data;

      this.setupRecommendChart(this.recommend);
      console.log('log1 recommed');
    } else if (cacheKey.includes('earnings_')) {
      this.earning = data;
      this.setupEarningsChart(this.earning);
      console.log(this.earning, 'log1 setup earning');
    } else if (cacheKey.includes('stdchart_')) {
      this.stdchart = data;
      console.log(this.stdchart, 'std chart');
      this.mystockchart(this.stdchart);
      this.loadedstockdata = true;

      // this.smaChart(this.stdchart);
    } else if (cacheKey.includes('sumtabchrt_')) {
      this.sumtabchrt = data;
      console.log(this.sumtabchrt, 'sum chart');
      this.sumtab(this.sumtabchrt);
    }
  }

  myfunc2(): void {
    console.log('HELLO');
  }

  sumtab(apiData: any) {
    console.log('entered', apiData);

    const toDate = new Date();

    toDate.setHours(23, 59, 59, 999);

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 5);
    fromDate.setHours(0, 0, 0, 0);

    const fromTime = fromDate.getTime();
    const toTime = toDate.getTime();

    const filteredStockPrices = apiData.results
      .filter((dataPoint: any) => {
        return dataPoint.t >= fromTime && dataPoint.t <= toTime;
      })
      .map((dataPoint: any) => {
        return [dataPoint.t, dataPoint.c];
      });
    console.log(filteredStockPrices);

    console.log('filterrrrrrr', filteredStockPrices);

    if (!apiData || !Array.isArray(apiData.results)) {
      console.error('Invalid apiData format: results array not found');
      return;
    }

    // const results = apiData.results;
    // console.log('HIGH CHARTS DATAAA', results);

    // const chartData = results.map((item: { t: any; vw: any; }) => {
    //   return [
    //     item.t,
    //     item.vw
    //   ];
    // });

    // console.log('Chart Data:', chartData);

    const lineColor =
      this.searchResult2 && this.searchResult2.d > 0 ? 'green' : 'red';

    this.tab1char = {
      chart: {
        type: 'spline',
        spacingRight: 140,
        // spacingBottom: 30,
      },
      title: {
        text: `${apiData.ticker.toUpperCase()} Hourly Price Variation`,
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          hour: '%H:%M',
          day: '%H:%M',
        },
        title: {
          text: '',
        },
        tickInterval: 3600 * 1000,
      },
      yAxis: {
        opposite: true,
        title: {
          text: '',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        headerFormat: '{series.name}<br>',
        pointFormat: '{point.x:%H:%M}: {point.y:.2f}',
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false,
          },
        },
      },
      series: [
        {
          type: 'line',
          name: apiData.ticker.toUpperCase(),
          data: filteredStockPrices,
          color: lineColor,
        },
      ],
    };
  }

  mystockchart(apiResponse: any): void {
    const ohlc = apiResponse.results.map((item: any) => [
      item.t,
      item.o,
      item.h,
      item.l,
      item.c,
    ]);

    const volume = apiResponse.results.map((item: any) => [item.t, item.v]);
    console.log('DATAAAAAAAAAAAAAAAAAAAAA', ohlc, volume);

    this.Highcharts4 = Highcharts;

    this.charttab = {
      chart: {
        reflow: true,
      },

      rangeSelector: {
        allButtonsEnabled: true,
        enabled: true,
        selected: 4,
      },
      title: {
        text: ` ${this.searchResult.ticker} Historical`,
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      navigator: {
        enabled: true,
      },
      scrollbar: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime',
        ordinal: true,
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          opposite: true,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          opposite: true,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      plotOptions: {
        series: {
          dataGrouping: {
            units: [
              ['week', [1]],
              ['month', [1, 2, 3, 4, 6]],
            ],
          },
        },
      },
      series: [
        {
          showInLegend: { enabled: false },
          type: 'candlestick',
          name: this.searchResult.ticker,
          id: this.searchResult.ticker,
          zIndex: 2,
          data: ohlc,
        },
        {
          showInLegend: { enabled: false },
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: this.searchResult.ticker,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: this.searchResult.ticker,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
    };
  }

  setupEarningsChart(earningsData: any[]) {
    console.log('', earningsData);
    earningsData.sort(
      (a, b) => new Date(b.period).getTime() - new Date(a.period).getTime()
    );

    const categories = earningsData.map((item) => item.period);
    const actualData = earningsData.map((item) => item.actual);
    const estimateData = earningsData.map((item) => item.estimate);
    const surprises = earningsData.map(
      (item) =>
        `${item.surprise.toFixed(2)} (${item.surprisePercent.toFixed(2)}%)`
    );

    this.earningsChart = {
      chart: {
        type: 'spline',
        spacingRight: 100,
      },
      title: {
        text: 'Actual vs Estimate Earnings',
      },
      xAxis: {
        categories: categories,
        labels: {},
        useHtml: true,
      },
      yAxis: {
        title: {
          text: 'Earnings',
        },
      },
      tooltip: {
        shared: true,
        pointFormat: '{series.name}: <b>{point.y}</b><br/>',
      },
      series: [
        {
          name: 'Actual',
          data: actualData,
        },
        {
          name: 'Estimate',
          data: estimateData,
        },
      ],
    };
  }

  setupRecommendChart(recommendData: any[]) {
    const categories = recommendData.map((item) => item.period.slice(0, 7));

    const colors = {
      strongBuy: '#006400',
      buy: '#49fc03',
      hold: '#fcb603',
      sell: '#FF0000',
      strongSell: '#8B0000',
    };

    const series: SeriesOptionsType[] = [
      {
        name: 'Strong Buy',
        type: 'column',
        data: recommendData.map((item) => item.strongBuy),
        color: colors.strongBuy,
      },
      {
        name: 'Buy',
        type: 'column',
        data: recommendData.map((item) => item.buy),
        color: colors.buy,
      },
      {
        name: 'Hold',
        type: 'column',
        data: recommendData.map((item) => item.hold),
        color: colors.hold,
      },
      {
        name: 'Sell',
        type: 'column',
        data: recommendData.map((item) => item.sell),
        color: colors.sell,
      },
      {
        name: 'Strong Sell',
        type: 'column',
        data: recommendData.map((item) => item.strongSell),
        color: colors.strongSell,
      },
    ];

    this.recommendchart = {
      chart: {
        type: 'column',
        spacingRight: 100,
      },
      title: {
        text: 'Recommendation Trends',
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 100,
            },
            chartOptions: {
              legend: {
                enabled: false,
              },
            },
          },
        ],
      },
      xAxis: {
        categories,
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis',
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: {
              color: 'black',
              textOutline: 'none',
            },
          },
        },
      },
      series: series,
    };
  }

  calculateSentiments(insightsData: { data: any[]; symbol: string }) {
    const data = insightsData.data;
    const symbol = insightsData.symbol;

    if (!Array.isArray(data)) {
      console.error('Data is not an array');
      return;
    }

    this.totalMspR = 0;
    this.positiveMspR = 0;
    this.negativeMspR = 0;
    this.totalChange = 0;
    this.positiveChange = 0;
    this.negativeChange = 0;

    data.forEach((insight) => {
      if (typeof insight === 'object') {
        this.totalMspR += insight.mspr || 0;
        this.totalChange += insight.change || 0;

        if (insight.mspr > 0) {
          this.positiveMspR += insight.mspr;
        } else if (insight.mspr < 0) {
          this.negativeMspR += insight.mspr;
        }

        if (insight.change > 0) {
          this.positiveChange += insight.change;
        } else if (insight.change < 0) {
          this.negativeChange += insight.change;
        }
      } else {
        console.error('Invalid insight data:', insight);
      }
    });
  }

  setMarketStatus() {
    const lastTimestampInSeconds = this.searchResult2.t;
    const lastTimestampInMilliseconds = lastTimestampInSeconds * 1000;
    const elapsedMilliseconds = Date.now() - lastTimestampInMilliseconds;
    const elapsedMinutes = elapsedMilliseconds / (1000 * 60);
    const marketOpenThreshold = 5;

    if (elapsedMinutes <= marketOpenThreshold) {
      this.marketStatus = 'Market is Open';
      this.marketStatusColor = 'green';
      this.lastCloseTimeString = '';
    } else {
      this.marketStatus = 'Market is Closed';
      this.marketStatusColor = 'red';
      const lastCloseTime = new Date(Date.now() - elapsedMilliseconds);
      this.lastCloseTimeString = lastCloseTime.toLocaleTimeString();
    }
  }

  cancelMethod() {
    this.searchInitiated = false;
    this.showSearchResult = false;
    this.searchResult = null;
    this.storedSearchInput = '';
    this.errorMessage = '';
    localStorage.clear();
    this.router.navigate(['/search/home']);
  }

  openDialog(newsItem: any): void {
    let dialogWidth = '40%';

    if (window.innerWidth <= 576) {
      dialogWidth = '90%';
    }

    this.dialog.open(NewscontentComponent, {
      maxWidth: '600px',
      maxHeight: '300px',
      width: dialogWidth,
      height: '55%',
      data: newsItem,
    });
  }
  checkIfInWatchlist(): void {
    console.log(this.searchResult);
    const companyName = this.searchResult.name;
    const ticker = this.searchResult.ticker;
    console.log('Checking watchlist...', { companyName, ticker });

    if (!ticker) {
      console.warn('No ticker available to check in watchlist.');
      return;
    }

    this.http
      .get<{ exists: boolean }>(
        `https://stockapp-backend-production-673d.up.railway.app/check-watchlist?company_name=${encodeURIComponent(
          companyName
        )}&ticker=${encodeURIComponent(ticker)}`
      )
      .subscribe({
        next: (response) => {
          this.isFilled = response.exists;
          console.log('Watchlist check result:', this.isFilled);
        },
        error: (error) => {
          console.error('Error checking watchlist:', error);
        },
      });
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedOption = event.option.value;

    this.getMethod(selectedOption);
  }

  openModalbuy(): void {
    this.http.get<number>('https://stockapp-backend-production-673d.up.railway.app/get-wallet').subscribe(
      (availableFunds) => {
        const dialogRef = this.dialog.open(BuycompComponent, {
          width: '450px',
          position: { top: '100px' },
          data: {
            symbol: this.searchResult.ticker,
            currentPrice: this.searchResult2.c,
            availableFunds: availableFunds,
            companyname: this.searchResult.name,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result?.bought) {
            this.watchlistmsg = `${this.searchResult.ticker} bought succesfully`;
            this.color = 'alert-success';
            this.getAllStockData();

            setTimeout(() => {
              this.watchlistmsg = '';
            }, 3000);
          }
        });
      },
      (error) => {
        console.error('Error fetching available funds:', error);
      }
    );
  }

  openModalsell(): void {
    this.http.get<number>('https://stockapp-backend-production-673d.up.railway.app/get-wallet').subscribe(
      (availableFunds) => {
        const dialogRef = this.dialog.open(SellcompComponent, {
          width: '450px',
          position: { top: '100px' },
          data: {
            symbol: this.searchResult.ticker,
            currentPrice: this.searchResult2.c,
            availableFunds: availableFunds,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result?.sold) {
            this.watchlistmsg = `${this.searchResult.ticker} sold succesfully`;
            this.color = 'alert-danger';
            this.getAllStockData();

            setTimeout(() => {
              this.watchlistmsg = '';
            }, 3000);
          }
        });
      },
      (error) => {
        console.error('Error fetching available funds:', error);
      }
    );
  }
}
