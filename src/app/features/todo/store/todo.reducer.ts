import { createReducer, on } from '@ngrx/store';
import { TodoActions } from './todo.actions';
import { Todo } from './todo.model';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoReducer = createReducer(
  initialState,

  on(TodoActions.loadTodos, state => ({ ...state, loading: true, error: null })),

  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    loading: false,
    todos,
  })),

  on(TodoActions.loadTodosError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TodoActions.toggleTodoComplete, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  }))
);
