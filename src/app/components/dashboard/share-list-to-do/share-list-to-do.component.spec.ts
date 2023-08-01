import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareListToDoComponent } from './share-list-to-do.component';

describe('ShareListToDoComponent', () => {
  let component: ShareListToDoComponent;
  let fixture: ComponentFixture<ShareListToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareListToDoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareListToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
