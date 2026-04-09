import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TodoActions } from './todo.actions';
import { Todo } from './todo.model';

@Injectable()
export class TodoEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() =>
        this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=10').pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(error =>
            of(TodoActions.loadTodosError({ error: error.message ?? 'Erro ao carregar tarefas' }))
          )
        )
      )
    )
  );
}
