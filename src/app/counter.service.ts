import { Injectable } from '@angular/core'
import { StateController, Action } from './store'
import { IAppService, Todo } from './app.service.types'
import { AppService } from './app.service'
import { map, mergeMap, withLatestFrom } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class CounterService extends StateController<number>{
    constructor() {
        super(0)
    }

}


