export interface EditorState {
  content: string;
  outline: Outline[];
  isDirty: boolean;
  autoSaveEnabled: boolean;
  lastSaved?: Date;
}

export interface Outline {
  id: string;
  level: number; // 1-6 (H1-H6)
  text: string;
  line: number;
  children?: Outline[];
}
