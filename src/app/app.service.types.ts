

import { interval, Observable, animationFrameScheduler, defer, concat, of } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';


export type Todo = {
    id: number,
    task: string,
    completed: boolean
}

export type Visibility = 'all' | 'active' | 'completed'

export type Message={
    type:'info' | 'warn' | 'error',
    message:string
}

export type IAppService = {
    visibility: Visibility,
    todos: Todo[],
    message:Message|null,
    isSearching:boolean,
    loading:boolean,
}

export class SearchTodo  {
    constructor(public searchText: string, public type:string='') {}
}

export class HasMessage {
    constructor(public type=''){}
}

export function getTodos(): Todo[] {
    return [
        { id: 1, task: 'Read Quran Daily', completed: false },
        { id: 2, task: 'Learn Arabic', completed: true },
        { id: 3, task: 'Trust on Allah', completed: false }
    ]
}

const frames$ = interval(0, animationFrameScheduler);

const ticks$ = defer(() => {
    const start = animationFrameScheduler.now();
    return frames$.pipe(
        map(() => animationFrameScheduler.now() - start),
    );
});

function valueOverTime(ms: number): Observable<number> {
    return ticks$.pipe(
        map(t => t / ms),
        takeWhile(t => t <= 1),
        x => concat(x, of(1)),
    );
}

export function tween(start: number, end: number, duration: number): Observable<number> {
    const difference = end - start;
    return valueOverTime(duration).pipe(
        map(d => Math.round(start + (d * difference)))
    );
}