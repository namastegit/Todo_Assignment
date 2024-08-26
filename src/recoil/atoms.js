import { atom } from 'recoil';

export const todosState = atom({
  key: 'todosState',
  default: [],
});

export const confirmModalState = atom({
  key: 'confirmModalState',
  default: {
    open: false,
    action: null,
    id: null,
  },
});