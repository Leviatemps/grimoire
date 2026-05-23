import { create } from 'zustand';
import { Item, FilterType } from '../types';
import * as DB from '../db/database';

interface ItemsState {
  items: Item[];
  filter: FilterType;
  selectedCategoryId: string | null;
  isLoading: boolean;

  // Actions
  loadItems: () => void;
  addItem: (item: Item) => void;
  updateItem: (item: Partial<Item> & { id: string }) => void;
  deleteItem: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setSelectedCategory: (id: string | null) => void;
  searchItems: (query: string) => Item[];

  // Derived
  filteredItems: () => Item[];
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  filter: 'all',
  selectedCategoryId: null,
  isLoading: false,

  loadItems: () => {
    set({ isLoading: true });
    try {
      const items = DB.getAllItems();
      set({ items, isLoading: false });
    } catch (e) {
      console.error('loadItems error', e);
      set({ isLoading: false });
    }
  },

  addItem: (item) => {
    DB.insertItem(item);
    set((state) => ({ items: [item, ...state.items] }));
  },

  updateItem: (partial) => {
    DB.updateItem(partial);
    set((state) => ({
      items: state.items.map((i) =>
        i.id === partial.id ? { ...i, ...partial, updatedAt: new Date().toISOString() } : i
      ),
    }));
  },

  deleteItem: (id) => {
    DB.deleteItem(id);
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },

  setFilter: (filter) => set({ filter }),

  setSelectedCategory: (id) => set({ selectedCategoryId: id }),

  searchItems: (query) => {
    if (!query.trim()) return get().items;
    return DB.searchItems(query);
  },

  filteredItems: () => {
    const { items, filter, selectedCategoryId } = get();
    let result = items;

    if (selectedCategoryId) {
      result = result.filter((i) => i.categoryId === selectedCategoryId);
    }

    if (filter !== 'all') {
      result = result.filter((i) => i.type === filter);
    }

    return result;
  },
}));
