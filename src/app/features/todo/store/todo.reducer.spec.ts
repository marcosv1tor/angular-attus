import { describe, it, expect } from 'vitest';
import { todoReducer, initialState } from './todo.reducer';
import { TodoActions } from './todo.actions';
import { Todo } from './todo.model';

const MOCK_TODOS: Todo[] = [
  { id: 1, title: 'Task A', completed: false },
  { id: 2, title: 'Task B', completed: true },
];

describe('todoReducer', () => {
  it('returns initial state by default', () => {
    expect(todoReducer(undefined, { type: '@@INIT' } as any)).toEqual(initialState);
  });

  it('loadTodos sets loading=true and clears error', () => {
    const state = todoReducer({ ...initialState, error: 'prev error' }, TodoActions.loadTodos());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loadTodosSuccess sets todos and loading=false', () => {
    const state = todoReducer(
      { ...initialState, loading: true },
      TodoActions.loadTodosSuccess({ todos: MOCK_TODOS })
    );
    expect(state.loading).toBe(false);
    expect(state.todos).toEqual(MOCK_TODOS);
  });

  it('loadTodosError sets error and loading=false', () => {
    const state = todoReducer(
      { ...initialState, loading: true },
      TodoActions.loadTodosError({ error: 'Network error' })
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('toggleTodoComplete flips completed flag on incomplete todo', () => {
    const state = todoReducer(
      { ...initialState, todos: MOCK_TODOS },
      TodoActions.toggleTodoComplete({ id: 1 })
    );
    expect(state.todos.find(t => t.id === 1)?.completed).toBe(true);
    expect(state.todos.find(t => t.id === 2)?.completed).toBe(true);
  });

  it('toggleTodoComplete on completed todo marks it pending', () => {
    const state = todoReducer(
      { ...initialState, todos: MOCK_TODOS },
      TodoActions.toggleTodoComplete({ id: 2 })
    );
    expect(state.todos.find(t => t.id === 2)?.completed).toBe(false);
  });
});
