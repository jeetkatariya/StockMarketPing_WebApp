import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuycompComponent } from './buycomp.component';

describe('BuycompComponent', () => {
  let component: BuycompComponent;
  let fixture: ComponentFixture<BuycompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuycompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuycompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
