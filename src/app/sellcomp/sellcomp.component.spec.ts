import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellcompComponent } from './sellcomp.component';

describe('SellcompComponent', () => {
  let component: SellcompComponent;
  let fixture: ComponentFixture<SellcompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellcompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
