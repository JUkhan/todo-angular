import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoContainerComponent } from './components/todo.container.component';
import { AddTodoComponent } from './components/add.todo.component';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from './components/message.component';
import { LoadingComponent } from './components/loading.component';
import { TodoItemComponent } from './components/todo.item.component';
import { ToolbarComponent } from './components/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoContainerComponent,
    AddTodoComponent,
    MessageComponent,
    LoadingComponent,
    TodoItemComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
