import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { todosState } from '../recoil/atoms';
import { fetchTodos } from '../services/todoService';

export function useTodos() {
  const setTodos = useSetRecoilState(todosState);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await fetchTodos();
        setTodos(todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    loadTodos();
  }, [setTodos]);

  return null; 
}