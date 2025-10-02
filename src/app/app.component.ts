import { Component,ViewChild,ElementRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  activeTab: string='Search';
  
  constructor(public router: Router) {
    
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTab(this.router.url);
      }
    });
  }

  setActiveTab(url: string) {
    console.log('myurl',url);
    if (url.includes('/search')) {
      this.activeTab = 'Search';
    } else if (url.includes('/watchlist')) {
      this.activeTab = 'Watchlist';
    } else if (url.includes('/portfolio')) {
      this.activeTab = 'Portfolio';
    }
  }
}