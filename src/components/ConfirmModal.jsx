import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { confirmModalState, todosState } from '../recoil/atoms';
import { updateTodo, deleteTodo } from '../services/todoService';

function ConfirmModal() {
  const [confirmModal, setConfirmModal] = useRecoilState(confirmModalState);
  const setTodos = useSetRecoilState(todosState);

  const handleConfirm = async () => {
    if (confirmModal.action === 'delete') {
      setTodos((prevTodos) => {
        const todoToDelete = prevTodos.find(todo => todo.id === confirmModal.id);
        if (todoToDelete && todoToDelete.isNew) {
          return prevTodos.filter((todo) => todo.id !== confirmModal.id);
        } else {
          deleteTodo(confirmModal.id).catch(error => console.error('Error deleting todo:', error));
          return prevTodos.filter((todo) => todo.id !== confirmModal.id);
        }
      });
    } else if (confirmModal.action === 'complete' || confirmModal.action === 'undo') {
      const completed = confirmModal.action === 'complete';
      setTodos((prevTodos) => {
        const todoToUpdate = prevTodos.find(todo => todo.id === confirmModal.id);
        if (todoToUpdate && todoToUpdate.isNew) {
          return prevTodos.map((todo) =>
            todo.id === confirmModal.id ? { ...todo, completed } : todo
          );
        } else {
          updateTodo(confirmModal.id, { completed }).catch(error => console.error('Error updating todo:', error));
          return prevTodos.map((todo) =>
            todo.id === confirmModal.id ? { ...todo, completed } : todo
          );
        }
      });
    }
    setConfirmModal({ open: false, action: null, id: null });
  };

  const handleCancel = () => {
    setConfirmModal({ open: false, action: null, id: null });
  };

  if (!confirmModal.open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg z-50 w-80">
        <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
        <p className="mb-4">
          {confirmModal.action === 'delete'
            ? 'Do you really want to delete this todo?'
            : confirmModal.action === 'complete'
            ? 'Mark this todo as completed?'
            : 'Undo the completion of this todo?'}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-white ${
              confirmModal.action === 'delete' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;