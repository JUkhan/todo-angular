import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '../app.service';
import { map } from 'rxjs';
import {SearchTodo} from '../app.service.types'
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-add-todo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
 <form #f="ngForm" (ngSubmit)="onSubmit(t)" class="mb-4">
      <div class="flex mt-4">
        <input #t (input)="changingText(t.value)"
          class="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
          type="text" 
          name="task"
          placeholder="{{placeholderText$|async}}"
        />
        <input type="checkbox" (click)="service.toggleSearch()" [checked]="service.isSearching$|async">
      </div>
    </form>
  `,

})
export class AddTodoComponent {
    constructor(public service: AppService) {

    }

    placeholderText$ = this.service.isSearching$.pipe(
        map(isTrue => isTrue ? 'Searching...' : 'What needs to be done?'))

    changingText(task:string){
        this.service.dispatch(new SearchTodo(task))
    }

    onSubmit(f:HTMLInputElement){
        this.service.addTodo(f.value);
        f.value='' 
    }
}
