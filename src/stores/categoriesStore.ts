import { create } from 'zustand';
import { Category, Subcategory } from '../types';
import * as DB from '../db/database';

interface CategoriesState {
  categories: Category[];
  subcategories: Subcategory[];
  isLoading: boolean;

  // Actions
  loadCategories: () => void;
  addCategory: (cat: Category) => void;
  updateCategory: (cat: Partial<Category> & { id: string }) => void;
  deleteCategory: (id: string) => void;

  addSubcategory: (sub: Subcategory) => void;
  deleteSubcategory: (id: string) => void;

  // Derived
  getCategoryById: (id: string) => Category | undefined;
  getSubcategoriesByCategoryId: (categoryId: string) => Subcategory[];
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  subcategories: [],
  isLoading: false,

  loadCategories: () => {
    set({ isLoading: true });
    try {
      const categories = DB.getAllCategories();
      const subcategories = DB.getAllSubcategories();
      set({ categories, subcategories, isLoading: false });
    } catch (e) {
      console.error('loadCategories error', e);
      set({ isLoading: false });
    }
  },

  addCategory: (cat) => {
    DB.insertCategory(cat);
    set((state) => ({ categories: [...state.categories, cat] }));
  },

  updateCategory: (partial) => {
    DB.updateCategory(partial);
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === partial.id ? { ...c, ...partial, updatedAt: new Date().toISOString() } : c
      ),
    }));
  },

  deleteCategory: (id) => {
    DB.deleteCategory(id);
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      subcategories: state.subcategories.filter((s) => s.categoryId !== id),
    }));
  },

  addSubcategory: (sub) => {
    DB.insertSubcategory(sub);
    set((state) => ({ subcategories: [...state.subcategories, sub] }));
  },

  deleteSubcategory: (id) => {
    DB.deleteSubcategory(id);
    set((state) => ({
      subcategories: state.subcategories.filter((s) => s.id !== id),
    }));
  },

  getCategoryById: (id) => get().categories.find((c) => c.id === id),

  getSubcategoriesByCategoryId: (categoryId) =>
    get().subcategories.filter((s) => s.categoryId === categoryId),
}));
