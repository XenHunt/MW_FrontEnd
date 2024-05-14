import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserButtonComponent } from './user.button.component';

describe('UserButtonComponent', () => {
  let component: UserButtonComponent;
  let fixture: ComponentFixture<UserButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserButtonComponent]
    });
    fixture = TestBed.createComponent(UserButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
