import React, { useState, useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { todosState, confirmModalState } from '../recoil/atoms';
import { updateTodo, deleteTodo } from '../services/todoService';

function TodoItem({ todo }) {
  const [editTodoText, setEditTodoText] = useState(todo.todo);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedTodoId, setExpandedTodoId] = useState(null);
  const [hoveredTodoId, setHoveredTodoId] = useState(null);
  const [blurActive, setBlurActive] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);

  const setTodos = useSetRecoilState(todosState);
  const setConfirmModal = useSetRecoilState(confirmModalState);
  const confirmModal = useRecoilValue(confirmModalState);

  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  const handleUpdateTodo = async (id, completed) => {
    try {
      if (todo.isNew) {
        setTodos((prevTodos) =>
          prevTodos.map((item) => (item.id === id ? { ...item, completed } : item))
        );
      } else {
        await updateTodo(id, { completed });
        setTodos((prevTodos) =>
          prevTodos.map((item) => (item.id === id ? { ...item, completed } : item))
        );
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEditTodo = async () => {
    if (editTodoText.trim() && editTodoText !== todo.todo) {
      setIsSaving(true);
      try {
        if (todo.isNew) {
          setTodos((prevTodos) =>
            prevTodos.map((item) => (item.id === todo.id ? { ...item, todo: editTodoText } : item))
          );
        } else {
          await updateTodo(todo.id, { todo: editTodoText });
          setTodos((prevTodos) =>
            prevTodos.map((item) => (item.id === todo.id ? { ...item, todo: editTodoText } : item))
          );
        }
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving todo:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      if (todo.isNew) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      } else {
        await deleteTodo(id);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const showConfirmModal = (action, id) => {
    setConfirmModal({ open: true, action, id });
  };

  
  const handleExpand = (id) => {
    setExpandedTodoId(expandedTodoId === id ? null : id);
  };

  const handleMouseEnter = (id) => {
    if (!confirmModal.open) {
      setHoveredTodoId(id);
      const timer = setTimeout(() => {
        setBlurActive(true);
      }, 5000);
      setHoverTimer(timer);
    }
  };

  const handleMouseLeave = () => {
    if (!confirmModal.open) {
      setHoveredTodoId(null);
      setBlurActive(false);
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    }
  };
  return (
    <div
      className={`p-6 rounded-lg shadow-md border border-gray-300 transition-all duration-500 ${
        expandedTodoId === todo.id ? 'sm:col-span-2' : ''
      } ${
        confirmModal.open
          ? ''
          : hoveredTodoId === todo.id
          ? 'z-40 bg-white scale-105 shadow-xl'
          : hoveredTodoId !== null && blurActive
          ? 'blur-sm'
          : ''
      }`}
      onMouseEnter={() => !confirmModal.open && handleMouseEnter(todo.id)}
      onMouseLeave={() => !confirmModal.open && handleMouseLeave()}
    >
      <div className="mb-4">
        <h2 className={`text-xl font-semibold ${todo.completed ? 'line-through' : ''}`}>
          {isEditing ? (
            <textarea
              className="border border-gray-400 rounded-lg w-full p-3 text-lg focus:outline-none resize-none h-24"
              value={editTodoText}
              onChange={(e) => setEditTodoText(e.target.value)}
            />
          ) : (
            <div>
              {todo.todo.length > 100 ? (
                expandedTodoId === todo.id ? (
                  <div>
                    {todo.todo}
                    <button
                      onClick={() => handleExpand(todo.id)}
                      className="text-blue-500 mt-2 block"
                    >
                      Show less
                    </button>
                  </div>
                ) : (
                  <div>
                    {todo.todo.slice(0, 100)}...
                    <button
                      onClick={() => handleExpand(todo.id)}
                      className="text-blue-500 mt-2 block"
                    >
                      Show more
                    </button>
                  </div>
                )
              ) : (
                todo.todo
              )}
            </div>
          )}
        </h2>
        <p className={`text-md ${todo.completed ? 'text-gray-500' : 'text-black'}`}>
          {todo.completed ? 'Completed' : 'Pending'}
        </p>
      </div>

      <div className="flex space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleEditTodo}
              className="px-4 py-2 rounded-lg text-white bg-blue-500"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditTodoText(todo.todo);
              }}
              className="px-4 py-2 bg-gray-300 text-white rounded-lg"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => showConfirmModal(todo.completed ? 'undo' : 'complete', todo.id)}
              className={`px-4 py-2 rounded-lg text-white ${
                todo.completed ? 'bg-gray-600' : 'bg-black'
              }`}
            >
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button
              onClick={() => showConfirmModal('delete', todo.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setIsEditing(true);
                setEditTodoText(todo.todo);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;