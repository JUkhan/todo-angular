import { Injectable } from '@angular/core'
import { StateController, Action } from './store'
import { IAppService, Todo } from './app.service.types'
import { AppService } from './app.service'
import { delay, map, mergeMap, withLatestFrom } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class CounterService extends StateController<number>{
    constructor() {
        super(0)
    }

    override onInit(): void {
        this.tearDown(
            this.remoteController(AppService).pipe(
                mergeMap(service => service.select(state => state.todos.length))
            ).subscribe(len => this.emit(len))
        )
        /*this.effectOnAction(
            this.action$.whereType('inc').pipe(
                delay(1300),
                withLatestFrom(
                    this.remoteStream<IAppService>(AppService).pipe(map(state=>state.todos.length))
                    ),
                    map(([_,len])=>len)
            )
        )*/

    }

    override onAction(action: Action): void {
        if (action.type === 'inc') {
            this.emit(this.state + 1)
        }
        else if (action.type === 'dec') {
            this.emit(this.state - 1)
        }
    }
}


