import { Component } from '@angular/core';

@Component({
  selector: 'app-dataservice',
  templateUrl: './dataservice.component.html',
  styleUrls: ['./dataservice.component.css']
})
export class DataserviceComponent {
  private searchData: any = null;
  setData(data: any) {
    this.searchData = data;
  }

  getData() {
    return this.searchData;
  }

  hasData(): boolean {
    return this.searchData !== null;
  }

}
