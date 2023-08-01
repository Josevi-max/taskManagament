import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignListToDoComponent } from './assign-list-to-do.component';

describe('AssignListToDoComponent', () => {
  let component: AssignListToDoComponent;
  let fixture: ComponentFixture<AssignListToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignListToDoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignListToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
