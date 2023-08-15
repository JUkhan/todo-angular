import { BehaviorSubject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Action } from "./action";

export class Actions {
  constructor(private _dispatcher: BehaviorSubject<Action>) {}

  whereType(actionType: string): Observable<Action> {
    return this._dispatcher.pipe(filter((action) => action.type == actionType));
  }

  where(predicate: (action: Action) => boolean): Observable<Action> {
    return this._dispatcher.pipe(filter(predicate));
  }

  isA<T extends Action>(actionOf: (new () => T) | (new (...args: any[]) => T)) {
    return this._dispatcher.pipe(
      filter((action) => action instanceof actionOf),
      map((action) => action as T)
    );
  }
}
