import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';

import { ajwahTest } from 'ajwah-test'
import { SearchTodo } from './app.service.types';

function delay(ms=0) {
    return new Promise(resolve=>setTimeout(resolve, ms));
}

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppService);
    service.importState({
        message: null,
        todos: [],
        visibility: 'all',
        isSearching: false,
        loading: false,
    })
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state', async () => {
    await ajwahTest({
      build: () => service.stream$,
      verify: res => {
        expect(res[0].todos.length).toBe(0)
       
      }
    });
  });

  it('loaded 3 tasks', async () => {
    await ajwahTest({
      build: () => service.stream$,
      skip:1,
      verify: res => {
        expect(res[0].todos.length).toBe(3)
       
      }
    });
  });

  it('showing loading when start to add a task', async () => {
    await ajwahTest({
      build: () => service.stream$,
      act:()=>{
        delay().then(()=>service.addTodo('task1'));
      },
      skip:2,
      //log:state=>console.log(JSON.stringify(state, null, 4)),
      verify: res => {
        expect(res[0].loading).toBe(true)
        expect(res[0].todos.length).toBe(3)
      }
    });
  });

  it('showing alert message "Todo added successfully"', async () => {
    await ajwahTest({
      build: () => service.stream$,
      act:()=>{
        delay().then(()=>service.addTodo('task1'));
      },
      wait:1300,
      skip:3,
      verify: res => {
        expect(res[0].message?.message).toEqual('Todo added successfully')
      }
    });
  });

  it('should have total 4 tasks after added successfully', async () => {
    await ajwahTest({
      build: () => service.stream$,
      act:()=>{
        delay().then(()=>service.addTodo('task1'));
      },
      wait:1300,
      skip:3,
      verify: res => {
        expect(res[0].todos.length).toBe(4)
      }
    });
  });

  it('should be loading false after task added successfully', async () => {
    await ajwahTest({
      build: () => service.stream$,
      act:()=>{
        delay().then(()=>service.addTodo('task1'));
      },
      wait:1300,
      skip:3,
      verify: res => {
        expect(res[0].loading).toBe(false)
      }
    });
  });

  it('should have total 3 todos', async () => {
    await ajwahTest({
      build: () => service.todo$,
      
      skip:1,
      verify: res => {
        expect(res[0].length).toBe(3)
      }
    });
  });

  it('should have 2 active tasks', async () => {
    await ajwahTest({
      build: () => service.todo$,
      act:()=>{
        delay().then(()=>{
            service.toggleSearch();
            service.setVisibility('active')
        })
      },
      skip:2,
      verify: res => {
        expect(res[0].length).toBe(2)
      }
    });
  });

  it('should have 1 completed task', async () => {
    await ajwahTest({
      build: () => service.todo$,
      act:()=>{
        delay().then(()=>{
            service.toggleSearch();
            service.setVisibility('completed')
        })
      },
      skip:2,
      verify: res => {
        expect(res[0].length).toBe(1)
      }
    });
  });

  it('should have 1 task search by "allah"', async () => {
    await ajwahTest({
      build: () => service.todo$,
      act:()=>{
        delay().then(()=>{
            service.toggleSearch();
            service.dispatch(new SearchTodo('allah'))
        })
      },
      skip:2,
      verify: res => {
        expect(res[0][0].task).toBe('Trust on Allah')
      }
    });
  });

});
