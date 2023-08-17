import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TodoContainerComponent } from './components/todo.container.component';
import { LoadingComponent } from './components/loading.component';
import { AddTodoComponent } from './components/add.todo.component';
import { ToolbarComponent } from './components/toolbar.component';
import { MessageComponent } from './components/message.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent,TodoContainerComponent, LoadingComponent, AddTodoComponent, ToolbarComponent,MessageComponent
    ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  
});
