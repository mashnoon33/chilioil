import { MarkerSeverity } from 'monaco-editor'
import { create } from 'zustand'

interface MonacoError {
  message: string
  severity: MarkerSeverity
  line?: number
  column?: number
}

interface ErrorState {
  errors: MonacoError[]
  addError: (error: MonacoError) => void
  removeError: (message: string) => void
  clearErrors: () => void
  setErrors: (errors: MonacoError[]) => void
}

export const useErrorStore = create<ErrorState>((set) => ({
  errors: [],
  addError: (error: MonacoError) => set((state) => ({ 
    errors: [...state.errors, error] 
  })),
  removeError: (message: string) => set((state) => ({ 
    errors: state.errors.filter(error => error.message !== message) 
  })),
  clearErrors: () => set({ errors: [] }),
  setErrors: (errors: MonacoError[]) => set({ errors }),
}))