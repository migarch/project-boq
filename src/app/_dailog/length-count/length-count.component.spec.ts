import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthCountComponent } from './length-count.component';

describe('LengthCountComponent', () => {
  let component: LengthCountComponent;
  let fixture: ComponentFixture<LengthCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LengthCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LengthCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
