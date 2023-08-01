import { TestBed } from '@angular/core/testing';

import { ListToDoService } from './list-to-do.service';

describe('ListToDoService', () => {
  let service: ListToDoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListToDoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
