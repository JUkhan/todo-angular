import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '../app.service';

@Component({
    selector: 'app-loading',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div style="position: relative;">
        <div style="position: absolute; display:inline-block; left:180px; top:-90px">
            <ng-container *ngIf="service.rotate$|async as rotate">
                <svg width="70" height="70" style="transform: rotate({{rotate}}deg);">
                    <circle cy="35" cx="35" r="35" fill="orange" />
                    <circle cy="15" cx="35" r="10" fill="white" />
                </svg>
            </ng-container>
        </div>
    </div>
  `

})
export class LoadingComponent {
    constructor(public service: AppService) { }
}
