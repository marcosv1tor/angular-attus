import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo } from './todo.model';

/**
 * createActionGroup agrupa ações relacionadas, evita repetição do source
 * e gera automaticamente o tipo da ação — prática recomendada no NgRx 15+.
 */
export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Load Todos':         emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Load Todos Error':   props<{ error: string }>(),
    'Toggle Todo Complete': props<{ id: number }>(),
  },
});
