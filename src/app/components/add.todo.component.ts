import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { Subject, map, takeUntil } from 'rxjs';
import { SearchTodo } from '../app.service.types'
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (ngSubmit)="onSubmit()" class="mb-4">
      <div class="flex mt-4">
        <input [formControl]="searchCtrl" 
          class="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
          type="text" 
          name="task"
          placeholder="{{placeholderText$|async}}"
        />
        <input type="checkbox" [formControl]="checkboxCtrl" >
      </div>
    </form>
  `,

})
export class AddTodoComponent implements OnDestroy {
  public searchCtrl: FormControl = new FormControl('');
  public checkboxCtrl: FormControl = new FormControl(false);
  private cleanup$ = new Subject();

  constructor(public service: AppService) {
    this.searchCtrl.valueChanges.pipe(takeUntil(this.cleanup$)).subscribe(value => this.service.dispatch(new SearchTodo(value)))
    this.checkboxCtrl.valueChanges.pipe(takeUntil(this.cleanup$)).subscribe(_ => {
      this.service.dispatch(new SearchTodo(''))
      this.service.toggleSearch()
      this.searchCtrl.setValue('')
    })
  }
  ngOnDestroy(): void {
    this.cleanup$.next(null)
  }

  placeholderText$ = this.service.isSearching$.pipe(
    map(isTrue => isTrue ? 'Searching...' : 'What needs to be done?'))

  onSubmit() {
    if (this.service.state.isSearching) return
    this.service.addTodo(this.searchCtrl.value);
    this.searchCtrl.setValue('')
  }
}
