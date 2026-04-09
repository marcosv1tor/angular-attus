import { describe, it, expect } from 'vitest';
import { selectAllTodos, selectPendingTodos } from './todo.selectors';
import { TodoState } from './todo.reducer';
import { Todo } from './todo.model';

const TODOS: Todo[] = [
  { id: 1, title: 'Task A', completed: false },
  { id: 2, title: 'Task B', completed: true },
  { id: 3, title: 'Task C', completed: false },
];

const mockState = {
  todos: { todos: TODOS, loading: false, error: null } satisfies TodoState,
};

describe('Todo Selectors', () => {
  it('selectAllTodos returns all todos', () => {
    expect(selectAllTodos(mockState)).toEqual(TODOS);
  });

  it('selectPendingTodos returns only incomplete todos', () => {
    const pending = selectPendingTodos(mockState);
    expect(pending).toHaveLength(2);
    expect(pending.every(t => !t.completed)).toBe(true);
  });
});
