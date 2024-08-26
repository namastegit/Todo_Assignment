import React from 'react';
import { useRecoilValue } from 'recoil';
import { todosState } from '../recoil/atoms';

function Summary() {
  const todos = useRecoilValue(todosState);

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const pendingTodos = todos.length - completedTodos;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="flex justify-between text-lg font-medium">
        <p>Completed: {completedTodos}</p>
        <p>Pending: {pendingTodos}</p>
      </div>
    </div>
  );
}

export default Summary;