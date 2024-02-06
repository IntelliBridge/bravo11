import { createSelectors } from './legacy/helpers'
import { create } from 'zustand'

const initialProjectState = {
  users: []
}

const createUserSlice = (set: any, ..._: any) => {
  const resetters: (() => any)[] = []
  resetters.push(() => set(initialProjectState))
  return {
    ...initialProjectState,
    addUser: (user: any) => {
      set((state: any) => ({
        ...state,
        projects: [user, ...state.users],
      }))
    },
    setUsers: (projects: object) => {
      set((state: object) => ({
        ...state,
        projects,
      }))
    }
  }
}

export const useProjectStore = createSelectors(
  create()((...a) => ({
    ...createUserSlice(...a),
  }))
)
