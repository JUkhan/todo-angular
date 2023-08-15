import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '../app.service';

@Component({
    selector: 'app-todo-container',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
<div class="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
    <h1 className="text-grey-darkest">Todo List</h1>
    <app-loading/>
    <app-add-todo/>
    <app-toolbar/>
    <ng-container *ngFor="let todo of service.todo$|async">
      <app-todo-item [todo]="todo"/>
    </ng-container>
    
    <app-message/>
   
</div>
  `,

})
export class TodoContainerComponent {
    constructor(public service:AppService){}
}
