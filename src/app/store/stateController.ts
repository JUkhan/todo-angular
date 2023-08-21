import { BehaviorSubject, Observable, Subscription, from, Subject } from 'rxjs';
import { map, distinctUntilChanged, mergeMap } from 'rxjs/operators';

import { Action } from './action';
import { Actions } from './actions';
import { shallowEqual } from './shallowEqual';

const _dispatcher = new BehaviorSubject<Action>({ type: '@INIT' });
const _action$ = new Actions(_dispatcher);

/**
  * Dispatches an action to update the controller's state.
  * @param {string | Action} actionName - The name of the action or an Action instance.
  */
export function dispatch(actionName: string | Action): void {
  if (typeof actionName === 'object') {
    _dispatcher.next(actionName);
    return;
  }
  _dispatcher.next({ type: actionName });
}

export const action$ = _action$

/**
 * Represents a base StateController class for managing state and actions.
 * typeparam S The type of the state managed by the controller.
 * 
 *```ts
 *class CounterState extends StateController<number>{
 *
 *    CounterState(){
 *       super(0);
 *    }
 *
 *    increment(){
 *       emit(state + 1);
 *    }
 *
 *    decrement(){
 *       emit(state - 1);
 *    }
 *
 *}
 *```
 */
export abstract class StateController<S> {

  /**
   * The BehaviorSubject that holds the current state.
   */
  private _store: BehaviorSubject<S>;

  /**
   * The subscription to actions and effects.
   */
  private _sub: Subscription;

  /**
   * Creates an instance of StateController.
   * @param {S} initialState - The initial state of the controller.
   */
  constructor(initialState: S) {
    this._store = new BehaviorSubject<S>(initialState);

    this._sub = _dispatcher.subscribe((action) => {
      this.onAction(action);
    });

    setTimeout(() => {
      this.onInit();
    }, 0);
  }

  /**
   * Handles incoming actions.
   * @param {Action} action - The action to be handled.
   */
  onAction(action: Action) {
    if (
      action instanceof RemoteControllerAction &&
      this instanceof action.payload
    ) {
      action.type(this);
    }
  }

  /**
   * This function is fired after instantiating the controller.
   */
  onInit() { }

  /**
 * Selects a slice of the state and returns it as an observable.
 * @typeparam T The type of the selected slice.
 * @param {function(state: S): T} mapFn - The function to map the state to the desired slice.
 * @returns {Observable<T>} An observable of the selected slice of the state.
 */
  select<T = any>(mapFn: (state: S) => T): Observable<T> {
    let mapped$;
    if (typeof mapFn === 'function') {
      mapped$ = this._store.pipe(map((source: any) => mapFn(source)));
    } else {
      throw new TypeError(
        `Unexpected type '${typeof mapFn}' in select operator,` +
        ` expected 'function'`
      );
    }
    return mapped$.pipe(
      distinctUntilChanged((prev, current) => shallowEqual(prev, current))
    );
  }

  /**
  * Gets an observable stream of the controller's state with distinct value changes.
  * @returns {Observable<S>} An observable stream of the controller's state with distinct value changes.
  */
  get stream$(): Observable<S> {
    return this._store.pipe(
      distinctUntilChanged((prev, current) => shallowEqual(prev, current))
    );
  }

  /**
  * Gets the Actions instance used for dispatching actions.
  * @returns {Actions} The Actions instance for dispatching actions.
  */
  get action$(): Actions {
    return _action$;
  }

  /**
  * Gets the current state of the controller.
  * @returns {S} The current state of the controller.
  */
  get state(): S {
    return this._store.value;
  }

  /**
  * Dispatches an action to update the controller's state.
  * @param {string | Action} actionName - The name of the action or an Action instance.
  */
  dispatch(actionName: string | Action): void {
    dispatch(actionName)
  }

  /**
  * Emits a new state or a partial state update to the controller's current state.
  * @param {Partial<S>} state - The new state or partial state update to be emitted.
  */
  emit(state: Partial<S>) {
    if (isPlainObj(state)) {
      this._store.next(Object.assign({}, this.state, state));
      return;
    }
    if (state !== undefined) {
      this._store.next(state as any);
    }
  }

  /**
 * Imports a new state and updates the controller's current state.
 * @param {S} state - The new state to be imported.
 */
  importState(state: S) {
    this._store.next(state);
  }

  /**
 * Retrieves remote data from a controller instance by dispatching a remote action.
 * @typeparam S - The type of the state managed by the remote controller.
 * @param {new () => S} controllerType - The constructor of the remote controller.
 * @returns {Promise<S>} A promise that resolves to the retrieved remote data.
 * @private
 */
  private remoteData<S extends StateController<any>>(
    controllerType: new () => S
  ): Promise<S> {
    return new Promise<S>((resolver) => {
      this.dispatch(new RemoteControllerAction(resolver, controllerType));
    });
  }

  /**
   * Retrieves the remote state from a controller instance by invoking remote data retrieval.
   * @typeparam S - The type of the state to be retrieved.
   * @typeparam T - The type of the remote controller.
   * @param {new () => T} controllerType - The constructor of the remote controller.
   * @returns {Promise<S>} A promise that resolves to the remote state.
   *
   *```ts
   *const category = await remoteState<SearchCategory>(SearchCategoryController);
   *```
   *
   */
  remoteState<S, T extends StateController<any> = any>(
    controllerType: new () => T
  ): Promise<S> {
    return this.remoteData<T>(controllerType).then((ctrl) => ctrl.state);
  }

  /**
   * Creates an observable of a remote controller instance by invoking a remote data retrieval.
   * @typeparam S The type of the state managed by the remote controller.
   * @param {new () => S} controllerType - The constructor of the remote controller.
   * @returns {Observable<S>} An observable of the remote controller instance.
   * 
   *`Example`
   *
   *```ts
   * this.remoteController(AppService)
   *    .pipe(
   *     mergeMap(s=>s.select(state=>state.todos.length))
   *    ).subscribe(num=>this.emit(num))
   *```
   */
  remoteController<S extends StateController<any>>(
    controllerType: new () => S
  ): Observable<S> {
    return from(this.remoteData<S>(controllerType));
  }

  /**
   * Creates an observable stream of data by merging the stream of a remote controller's state.
   * @typeparam S The type of the state being observed.
   * @typeparam T The type of the remote controller.
   * @param {new () => T} controllerType - The constructor of the remote controller.
   * @returns {Observable<S>} An observable stream of the merged remote controller's state.
   *
   *`Example`
   *
   *```
   *this.effectOnAction(
   *     this.action$.whereType('inc').pipe(
   *         withLatestFrom(this.remoteStream<IAppService>(AppService)),
   *         map(([_, state])=>state.todos.length)
   *    )
   *);
   *this.remoteStream<IAppService>(AppService).pipe(
   *     map(state=>state.todos.length)
   *    ).subscribe(console.log)
   *
   *```
   */
  remoteStream<S, T extends StateController<any> = any>(
    controllerType: new () => T
  ): Observable<S> {
    return this.remoteController<T>(controllerType).pipe(
      mergeMap((ctrl) => ctrl.stream$)
    );
  }

  /**
   *Applies an effect to the provided stream of data, emitting the data to the controller's state.
   * @param {Observable<S>} aStream - The stream of data to apply the effect on.
   * 
   * Use this function inside `onInit()` method only
   *
   *`Example`
   *```ts
   *void onInit() {
   *   effectOnAction(action$
   *     .whereType('testEffectOnAction')
   *     .map((event) => 101)
   *   );
   *}
   *```
   */
  effectOnAction(aStream: Observable<S>) {
    this._sub.add(aStream.subscribe((data) => this.emit(data)));
  }

  /**
   * Disposes of the subscription to actions and effects.
   */
  dispose(): void {
    this._sub.unsubscribe();
  }

  /**
   * Defines an effect function that transforms an observable input into
   * a partial state update and sets up the subscription.
   * ```ts
   *
   * Example
   *
   * searchProduct = this.effect<string>(name$ => name$.pipe(
   *     debounceTime(230),
   *     distinctUntilChanged(),
   *     tap(_=>this.emit({status:'loading'})
   *     map(name => name.toUpperCase()),
   *     switchMap(name => api.searchProduct(name)),
   *     map(products => ({status:'loaded', products}))
   *  )
   * );
   * ```
   *
   */

  effect<T>(
    fx: (arg$: Observable<T>) => Observable<Partial<S>>
  ): (arg: T) => void {
    const subject = new Subject<T>();
    this._sub.add(fx(subject).subscribe((e) => this.emit(e)));
    return (arg: T) => {
      subject.next(arg);
    };
  }

  /**
  * Tears down a subscription by adding it to the internal collection.
  * @param {Subscription} subscription - The subscription to tear down.
  * @returns {void}
  */
  tearDown(subscription: Subscription): void {
    if (subscription instanceof Subscription) {
      this._sub.add(subscription);
    }
  }

}

/**
 * Checks if the provided value is a plain object.
 * @param {any} o - The value to check.
 * @returns {boolean} Returns true if the value is a plain object, otherwise false.
 */
function isPlainObj(o: any) {
  return o ? typeof o == 'object' && o.constructor == Object : false;
}

/**
 * Represents an action that can be dispatched to remote controllers.
 * @implements {Action}
 */
class RemoteControllerAction implements Action {
  constructor(public type: (state: any) => void, public payload: any) { }
}
