import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  state => state.todos
);

export const selectPendingTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(t => !t.completed)
);

export const selectTodosLoading = createSelector(
  selectTodoState,
  state => state.loading
);

export const selectTodosError = createSelector(
  selectTodoState,
  state => state.error
);
