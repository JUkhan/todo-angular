import { TestBed } from '@angular/core/testing';

import { CounterService } from './counter.service';

import { ajwahTest } from 'ajwah-test'


describe('CounterService', () => {
  let service: CounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:CounterService, useValue:new CounterService()}]
    });
    service = TestBed.inject(CounterService);
    service.importState(0)
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state 0', async () => {
    await ajwahTest({
      build: () => service.stream$,
      verify: res => {
        expect(res[0]).toEqual(0)
       
      }
    });
  });

  it('should have value 1 after dispatch inc', async () => {
    await ajwahTest({
      build: () => service.stream$,
      act: () => {
        service.dispatch('inc')
      },
      skip: 1,
      verify: res => {
        expect(res[0]).toEqual(1)
      }
    });
  });

  it('should have value -1 after dispatch dec', async () => {
    await ajwahTest({
      build: () => service.stream$,
      act: () => {
        service.dispatch('dec')
      },
      skip: 1,
      verify: res => {
        expect(res[0]).toEqual(-1)
        
      }
    });
  });

});
