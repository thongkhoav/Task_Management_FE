import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMemberComponent } from './room-member.component';

describe('RoomMemberComponent', () => {
  let component: RoomMemberComponent;
  let fixture: ComponentFixture<RoomMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomMemberComponent]
    });
    fixture = TestBed.createComponent(RoomMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
