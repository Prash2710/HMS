import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistsComponent } from './receptionists.component';

describe('ReceptionistsComponent', () => {
  let component: ReceptionistsComponent;
  let fixture: ComponentFixture<ReceptionistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionistsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceptionistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
