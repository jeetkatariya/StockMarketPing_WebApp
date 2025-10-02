import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import {HttpClientModule} from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatTabsModule} from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {MatFormFieldModule} from '@angular/material/form-field';



import { CalldataService } from './calldata.service';
import { HighchartsChartModule } from 'highcharts-angular';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewscontentComponent } from './newscontent/newscontent.component';
import { DataserviceComponent } from './dataservice/dataservice.component';
import { BuycompComponent } from './buycomp/buycomp.component';
import { SellcompComponent } from './sellcomp/sellcomp.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WatchlistComponent,
    PortfolioComponent,
    NewscontentComponent,
    DataserviceComponent,
    BuycompComponent,
    SellcompComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatCardModule,
    HighchartsChartModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    // MatDividerModule,
    MatButtonModule,
    MatIconModule,
    
 
  ],
  providers: [CalldataService],
  bootstrap: [AppComponent]
})
export class AppModule {
  

 }
