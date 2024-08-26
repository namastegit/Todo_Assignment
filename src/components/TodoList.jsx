import React from 'react';
import { useRecoilValue } from 'recoil';
import { todosState } from '../recoil/atoms';
import TodoItem from './TodoItem';

function TodoList() {
  const todos = useRecoilValue(todosState);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl relative">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

export default TodoList;