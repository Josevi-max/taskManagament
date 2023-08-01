import { TestBed } from '@angular/core/testing';

import { ShareListService } from './share-list.service';

describe('ShareListService', () => {
  let service: ShareListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
