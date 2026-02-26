import { createContext } from 'react';
import { Todo } from '../types/Todo';

export interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoContext = createContext<Props>({
  todos: [],
  setTodos: () => {},
  loadingIds: [],
  setLoadingIds: () => {},
});
