import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataserviceComponent } from './dataservice.component';

describe('DataserviceComponent', () => {
  let component: DataserviceComponent;
  let fixture: ComponentFixture<DataserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataserviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
