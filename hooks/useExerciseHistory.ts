import { create } from 'zustand';

interface Exercise {
  id: string;
  exercise: string;
  confidence: number;
  reps?: number;
  timestamp: number;
}

interface HistoryStore {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

export const useExerciseHistory = create<HistoryStore>((set) => ({
  exercises: [],
  addExercise: (exercise) => set((state) => ({
    exercises: [
      {
        ...exercise,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      },
      ...state.exercises,
    ],
  })),
  clearHistory: () => set({ exercises: [] }),
}));