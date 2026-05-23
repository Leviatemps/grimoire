// ─── Item types ───────────────────────────────────────────────────────────────

export type ItemType = 'link' | 'photo' | 'note';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description?: string;
  coverImage?: string;       // URI or URL
  url?: string;              // for links
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogSiteName?: string;
  categoryId?: string;
  subcategoryId?: string;
  createdAt: string;         // ISO string
  updatedAt: string;
}

// ─── Category types ───────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  color: string;             // hex
  icon: string;              // emoji or icon name
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export type FilterType = 'all' | ItemType;

export interface OGData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
}

// ─── Form types ───────────────────────────────────────────────────────────────

export interface AddLinkForm {
  url: string;
  title: string;
  description: string;
  coverImage: string;
  categoryId: string;
  subcategoryId: string;
}

export interface AddPhotoForm {
  photoUri: string;
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
}

export interface AddNoteForm {
  title: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
}

export interface AddCategoryForm {
  name: string;
  color: string;
  icon: string;
}
