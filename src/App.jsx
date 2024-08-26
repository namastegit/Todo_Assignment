import React from 'react';
import { RecoilRoot } from 'recoil';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import Summary from './components/Summary';
import ConfirmModal from './components/ConfirmModal';
import { useTodos } from './hooks/useTodos';

function AppContent() {
  useTodos(); 

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-black mb-8">My To-Do List</h1>
      <AddTodo />
      <Summary />
      <TodoList />
      <ConfirmModal />
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
}

export default App;