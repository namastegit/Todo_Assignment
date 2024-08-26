import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { todosState } from '../recoil/atoms';
import { addTodo } from '../services/todoService';

function AddTodo() {
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const setTodos = useSetRecoilState(todosState);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      setIsAdding(true);
      try {
        const addedTodo = await addTodo(newTodo);
        const newTodoWithId = { 
          ...addedTodo, 
          id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isNew: true 
        };
        setTodos((prevTodos) => [newTodoWithId, ...prevTodos]);
        setNewTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mb-6">
      <div className="mb-4 flex flex-col">
        <textarea
          className="border border-gray-400 rounded-lg w-full p-3 text-lg focus:outline-none focus:ring-2 focus:ring-black h-24 resize-none"
          placeholder="Add a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          className="mt-3 bg-black text-white px-5 py-3 rounded-lg"
          onClick={handleAddTodo}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  );
}

export default AddTodo;