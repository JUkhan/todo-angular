import { Injectable } from "@angular/core";
import { StateController } from './store';
import { getTodos, HasMessage, IAppService, Visibility, SearchTodo, Todo, tween } from './app.service.types'
import { delay, filter, tap, map, combineLatest, startWith, exhaustMap, repeat, takeUntil, endWith } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AppService extends StateController<IAppService>{

    constructor() {
        super({
            message: null,
            todos: [],
            visibility: 'all',
            isSearching: false,
            loading: false,
        });
    }

    override onInit() {
        this.emit({ todos: getTodos() })
        this.effectOnAction(
            this.action$.isA(HasMessage).pipe(
                filter(_ => this.state.message !== null),
                delay(3000),
                map(_ => (<IAppService>{ message: null }))
            )
        )
    }

    setVisibility(visibility: Visibility) {
        this.emit({ visibility })
    }

    toggleSearch() {
        this.emit({ isSearching: !this.state.isSearching })
    }

    addTodo(task: string) {
        if (this.state.isSearching) return
        if (!task) {
            this.emit({ message: { type: 'error', message: 'Task is required.' } })
            return
        }
        const todos = this.state.todos.concat();
        todos.push({ id: todos.length + 1, task, completed: false })
        this.throttle({ todos, message: { type: 'info', message: 'Todo added successfully' } });
        this.dispatch('inc')
    }

    updateTodo(id: number) {
        const todos = this.state.todos.map(todo => {
            if (todo.id === id) {
                todo = { ...todo, completed: !todo.completed }
            }
            return todo;
        });

        this.throttle({ todos, message: { type: 'info', message: 'Todo updated successfully' } });
    }

    removeTodo(id: number) {
        const todos = this.state.todos.filter(todo => todo.id !== id);
        this.throttle({ todos, message: { type: 'info', message: 'Todo removed successfully' } });
    }

    #loadingStart$ = this.select(state => state.loading).pipe(filter(val => val));

    #loadingEnd$ = this.select(state => state.loading).pipe(filter(val => !val));

    rotate$ = this.#loadingStart$.pipe(
        exhaustMap(() => tween(0, 360, 1000).pipe(
            repeat(),
            takeUntil(this.#loadingEnd$),
            endWith(0)
        ))
    )

    isSearching$ = this.select(state => state.isSearching)

    message$ = this.select(state => state.message).pipe(
        tap(msg => {
            if (msg) { this.dispatch(new HasMessage()) }
        }),
    );

    activeTodo$ = this.select(state => state.todos).pipe(
        map(todos => todos.filter(todo => !todo.completed).length));

    visibility$ = this.select(state => state.visibility)

    todo$ = combineLatest([
        this.select(state => state.todos),
        this.select(state => state.visibility),
        this.action$.isA(SearchTodo).pipe(
            filter(_ => this.state.isSearching),
            map(search => search.searchText),
            startWith('')
        ),
    ]).pipe(
        map(([todos, visibility, searchText]) => {
            if (searchText) {
                todos = todos.filter(todo => todo.task.toLowerCase().includes(searchText))
            }
            if (visibility === 'active') {
                todos = todos.filter(todo => !todo.completed)
            }
            else if (visibility === 'completed') {
                todos = todos.filter(todo => todo.completed)
            }
            return todos;
        })
    );

    throttle = this.effect<Partial<IAppService>>(todo$ => todo$.pipe(
        tap(_ => this.emit({ loading: true })),
        delay(1300),
        map(state => {
            state.loading = false;
            return state;
        })
    ));
}