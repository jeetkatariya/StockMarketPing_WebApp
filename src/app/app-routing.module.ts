import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: '', redirectTo: 'search/home', pathMatch: 'full' },
  { path: 'search/:ticker', component: HomeComponent },
  { path: 'search/home', component:HomeComponent },
  { path: 'watchlist', component:WatchlistComponent },
  { path: 'portfolio', component:PortfolioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  
  HttpClientModule,

  
  ],
  exports: [RouterModule],

})
export class AppRoutingModule { 
  constructor (){}
}
