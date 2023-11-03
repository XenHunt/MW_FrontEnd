import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAccessComponent } from './not-access.component';

describe('NotAccessComponent', () => {
  let component: NotAccessComponent;
  let fixture: ComponentFixture<NotAccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotAccessComponent]
    });
    fixture = TestBed.createComponent(NotAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
