
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Declaration, DeclarationState } from '@/types/declaration';
import { useAuthStore } from './authStore';

export const useDeclarationStore = create<DeclarationState>()(
  persist(
    (set, get) => ({
      declarations: [],
      currentDeclaration: null,
      isLoading: false,
      error: null,

      createDeclaration: (declaration) => {
        try {
          set({ isLoading: true });
          const newDeclaration: Declaration = {
            ...declaration,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            userId: useAuthStore.getState().user?.id || '1'
          };
          
          set(state => ({
            declarations: [...state.declarations, newDeclaration],
            currentDeclaration: newDeclaration,
            isLoading: false,
            error: null
          }));
          return true;
        } catch (error) {
          set({ error: 'Failed to create declaration', isLoading: false });
          return false;
        }
      },
      
      updateDeclaration: (id: string, updatedDeclaration: Partial<Declaration>) => {
        set({ isLoading: true });
        try {
          set(state => ({
            declarations: state.declarations.map(dec => 
              dec.id === id ? { ...dec, ...updatedDeclaration } : dec
            ),
            isLoading: false,
            error: null
          }));
          return true;
        } catch (error) {
          set({ error: 'Failed to update declaration', isLoading: false });
          return false;
        }
      },

      deleteDeclaration: (id: string) => {
        set({ isLoading: true });
        try {
          set(state => ({
            declarations: state.declarations.filter(dec => dec.id !== id),
            isLoading: false,
            error: null
          }));
          return true;
        } catch (error) {
          set({ error: 'Failed to delete declaration', isLoading: false });
          return false;
        }
      },
      
      getDeclarations: () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set({ error: 'User not authenticated' });
          return;
        }
        
        set({ isLoading: true });
        try {
          const userDeclarations = get().declarations.filter(
            declaration => declaration.userId === userId
          );
          set({
            declarations: userDeclarations,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({ error: 'Failed to fetch declarations', isLoading: false });
        }
      },
      
      getDeclaration: (id: string) => {
        set({ isLoading: true });
        try {
          const declaration = get().declarations.find(d => d.id === id);
          set({
            currentDeclaration: declaration || null,
            isLoading: false,
            error: declaration ? null : 'Declaration not found'
          });
        } catch (error) {
          set({ error: 'Failed to fetch declaration', isLoading: false });
        }
      },
      
      clearCurrentDeclaration: () => set({ currentDeclaration: null }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'declaration-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
