import { writable } from 'svelte/store';
import type { EditorState, Outline } from '$lib/types/editor';

const createEditorStore = () => {
  const { subscribe, set, update } = writable<EditorState>({
    content: '',
    outline: [],
    isDirty: false,
    autoSaveEnabled: true,
  });

  return {
    subscribe,
    updateContent: (content: string) => {
      update((state) => ({ ...state, content, isDirty: true }));
    },
    updateOutline: (outline: Outline[]) => {
      update((state) => ({ ...state, outline }));
    },
    setClean: () => {
      update((state) => ({ ...state, isDirty: false, lastSaved: new Date() }));
    },
    reset: () => {
      set({
        content: '',
        outline: [],
        isDirty: false,
        autoSaveEnabled: true,
      });
    },
    toggleAutoSave: () => {
      update((state) => ({ ...state, autoSaveEnabled: !state.autoSaveEnabled }));
    },
  };
};

export const editor = createEditorStore();
