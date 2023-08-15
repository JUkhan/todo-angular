import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AppService } from '../app.service';
import { Todo } from '../app.service.types';

@Component({
    selector: 'app-todo-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flex bg-white border p-2 justify-between">
        <input (click)="service.updateTodo(todo.id)" type="checkbox" [checked]="todo.completed">
        <span>{{todo.task}}</span>
        <button
            class="text-red-300 hover:text-red-700"
            (click)="service.removeTodo(todo.id)">
                Remove
      </button>
    </div>
  `,

})
export class TodoItemComponent {
    @Input({required:true}) todo!:Todo
    constructor(public service:AppService){}
}
