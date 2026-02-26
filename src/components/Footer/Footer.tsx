import classNames from 'classnames';
import React from 'react';
import { useContext } from 'react';
import { Filter } from '../../types/Filters';
import { TodoContext } from '../../store/TodoContext';
import { ErrorContext } from '../../store/ErrorContext';
import { deleteTodo } from '../../api/todos';

type Props = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

export const Footer: React.FC<Props> = ({ filter, setFilter }) => {
  const { todos, setTodos, setLoadingIds } = useContext(TodoContext);
  const { showError } = useContext(ErrorContext);

  const filters: Filter[] = ['All', 'Active', 'Completed'];
  const completed = todos.filter(todo => todo.completed);
  const completedCount = completed.length;
  const active = todos.filter(todo => !todo.completed);
  const activeCount = active.length;

  const deleteAllCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    const idsToDelete = completedTodos.map(todo => todo.id);

    setLoadingIds(idsToDelete);

    const results = await Promise.allSettled(
      idsToDelete.map(id => deleteTodo(id)),
    );

    const successfulIds: number[] = [];
    let hasError = false;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value === 1) {
          successfulIds.push(idsToDelete[index]);
        } else {
          hasError = true;
        }
      } else {
        hasError = true;
      }
    });

    if (successfulIds.length) {
      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
    }

    if (hasError) {
      showError('Unable to delete todos');
    }

    setLoadingIds([]);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} item{activeCount !== 1 ? 's' : ''} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(item => {
          return (
            <a
              key={item}
              href={`#/${item}`}
              data-cy={`FilterLink${item}`}
              className={classNames('filter__link', {
                selected: filter === item,
              })}
              onClick={() => setFilter(item)}
            >
              {item}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
