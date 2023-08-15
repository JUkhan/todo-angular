import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AppService } from '../app.service';
import { Todo } from '../app.service.types';

@Component({
    selector: 'app-toolbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div>
        <div class="float-left">{{service.activeTodo$|async}}  items left</div>
        <div class="float-right" *ngIf="service.visibility$|async as visibility">
            <button
                [class]="btnClasses(visibility === 'all')"
                (click)="service.setVisibility('all')">All</button>
            <button
            [class]="btnClasses(visibility === 'active')"
                (click)="service.setVisibility('active')">Active</button>

            <button
                [class]="btnClasses(visibility === 'completed')"
                (click)="service.setVisibility('completed')">Completed</button>
        </div>
        <div class="clear-both"></div>
    </div>
  `,

})
export class ToolbarComponent {
    
    constructor(public service:AppService){}

    btnClasses(isActive: boolean) {
        return `mr-2 text-blue-500 hover:text-blue-800 ${isActive ? 'active' : ''}`
    }
}
