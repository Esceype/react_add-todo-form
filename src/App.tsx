import './App.scss';

import React, { useState } from 'react';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';
import { User } from './types/User';
import { Todo } from './types/Todo';

function getUser(userId: number): User | null {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
}

export const todos = todosFromServer.map(todo => ({
  ...todo,
  user: getUser(todo.userId),
}));

export const App = () => {
  const [title, setTitle] = useState('');
  const [userId, setuserId] = useState(0);
  const [updatedTodos, setUpdatedTodos] = useState(todos);
  const [checkSelection, setcheckSelection] = useState(false);

  const maxId = (currentTodos: Todo[]) => {
    // const copyUpdatedTodos = currentTodos;

    // copyUpdatedTodos.sort((x, y) => x.id - y.id);

    // return copyUpdatedTodos[copyUpdatedTodos.length - 1].id + 1;
    return Math.max(...currentTodos.map(todo => todo.id)) + 1;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title !== '' && userId !== 0) {
      const addTodo = {
        user: getUser(userId),
        id: maxId(updatedTodos),
        title,
        completed: false,
        userId,
      };

      setUpdatedTodos(current => ([
        ...current,
        addTodo,
      ]));

      setuserId(0);
      setTitle('');
      setcheckSelection(false);
    } else {
      setcheckSelection(true);
    }
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/users"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <input
            type="text"
            name="title"
            data-cy="titleInput"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Type a new title"
          />
          {!title && checkSelection && (
            <span className="error">Please enter a title</span>
          )}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={userId}
            onChange={(event) => setuserId(+event.target.value)}
          >
            <option value="0" disabled>Choose a user</option>
            {usersFromServer.map(user => (
              <option value={user.id} key={user.id}>{user.name}</option>
            ))}
          </select>

          {userId === 0 && checkSelection && (
            <span className="error">Please choose a user</span>
          )}
        </div>

        <button
          type="submit"
          data-cy="submitButton"
        >
          Add
        </button>
      </form>

      <TodoList todos={updatedTodos} />
    </div>
  );
};
