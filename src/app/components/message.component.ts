import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '../app.service';

@Component({
    selector: 'app-message',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
<ng-container *ngIf="service.message$|async as obj">
    <div class="{{obj.type}}">{{obj.message}}</div>
</ng-container>
  `,

})
export class MessageComponent {
    constructor(public service:AppService){}
}
