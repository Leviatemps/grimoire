import * as SQLite from 'expo-sqlite';
import { Item, Category, Subcategory } from '../types';

// ─── DB singleton ─────────────────────────────────────────────────────────────

let _db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    _db = SQLite.openDatabaseSync('grimoire.db');
  }
  return _db;
}

// ─── Migrations ───────────────────────────────────────────────────────────────

export async function initDatabase(): Promise<void> {
  const db = getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      color       TEXT NOT NULL DEFAULT '#6366f1',
      icon        TEXT NOT NULL DEFAULT '📁',
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subcategories (
      id           TEXT PRIMARY KEY,
      category_id  TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name         TEXT NOT NULL,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS items (
      id              TEXT PRIMARY KEY,
      type            TEXT NOT NULL CHECK(type IN ('link','photo','note')),
      title           TEXT NOT NULL,
      description     TEXT,
      cover_image     TEXT,
      url             TEXT,
      og_title        TEXT,
      og_description  TEXT,
      og_image        TEXT,
      og_site_name    TEXT,
      category_id     TEXT REFERENCES categories(id) ON DELETE SET NULL,
      subcategory_id  TEXT REFERENCES subcategories(id) ON DELETE SET NULL,
      created_at      TEXT NOT NULL,
      updated_at      TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_items_category    ON items(category_id);
    CREATE INDEX IF NOT EXISTS idx_items_type        ON items(type);
    CREATE INDEX IF NOT EXISTS idx_items_created_at  ON items(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_sub_category      ON subcategories(category_id);
  `);
}

// ─── Item helpers ─────────────────────────────────────────────────────────────

function rowToItem(row: Record<string, unknown>): Item {
  return {
    id:             row.id as string,
    type:           row.type as Item['type'],
    title:          row.title as string,
    description:    (row.description as string) ?? undefined,
    coverImage:     (row.cover_image as string) ?? undefined,
    url:            (row.url as string) ?? undefined,
    ogTitle:        (row.og_title as string) ?? undefined,
    ogDescription:  (row.og_description as string) ?? undefined,
    ogImage:        (row.og_image as string) ?? undefined,
    ogSiteName:     (row.og_site_name as string) ?? undefined,
    categoryId:     (row.category_id as string) ?? undefined,
    subcategoryId:  (row.subcategory_id as string) ?? undefined,
    createdAt:      row.created_at as string,
    updatedAt:      row.updated_at as string,
  };
}

export function getAllItems(): Item[] {
  const db = getDb();
  const rows = db.getAllSync(
    'SELECT * FROM items ORDER BY created_at DESC'
  ) as Record<string, unknown>[];
  return rows.map(rowToItem);
}

export function getItemsByCategory(categoryId: string): Item[] {
  const db = getDb();
  const rows = db.getAllSync(
    'SELECT * FROM items WHERE category_id = ? ORDER BY created_at DESC',
    [categoryId]
  ) as Record<string, unknown>[];
  return rows.map(rowToItem);
}

export function searchItems(query: string): Item[] {
  const db = getDb();
  const q = `%${query}%`;
  const rows = db.getAllSync(
    `SELECT * FROM items
     WHERE title LIKE ? OR description LIKE ? OR og_title LIKE ? OR og_description LIKE ?
     ORDER BY created_at DESC`,
    [q, q, q, q]
  ) as Record<string, unknown>[];
  return rows.map(rowToItem);
}

export function insertItem(item: Item): void {
  const db = getDb();
  db.runSync(
    `INSERT INTO items
       (id, type, title, description, cover_image, url, og_title, og_description,
        og_image, og_site_name, category_id, subcategory_id, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      item.id,
      item.type,
      item.title,
      item.description ?? null,
      item.coverImage ?? null,
      item.url ?? null,
      item.ogTitle ?? null,
      item.ogDescription ?? null,
      item.ogImage ?? null,
      item.ogSiteName ?? null,
      item.categoryId ?? null,
      item.subcategoryId ?? null,
      item.createdAt,
      item.updatedAt,
    ]
  );
}

export function updateItem(item: Partial<Item> & { id: string }): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.runSync(
    `UPDATE items SET
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       cover_image = COALESCE(?, cover_image),
       category_id = COALESCE(?, category_id),
       subcategory_id = COALESCE(?, subcategory_id),
       updated_at = ?
     WHERE id = ?`,
    [
      item.title ?? null,
      item.description ?? null,
      item.coverImage ?? null,
      item.categoryId ?? null,
      item.subcategoryId ?? null,
      now,
      item.id,
    ]
  );
}

export function deleteItem(id: string): void {
  const db = getDb();
  db.runSync('DELETE FROM items WHERE id = ?', [id]);
}

// ─── Category helpers ─────────────────────────────────────────────────────────

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id:        row.id as string,
    name:      row.name as string,
    color:     row.color as string,
    icon:      row.icon as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function getAllCategories(): Category[] {
  const db = getDb();
  const rows = db.getAllSync(
    'SELECT * FROM categories ORDER BY name ASC'
  ) as Record<string, unknown>[];
  return rows.map(rowToCategory);
}

export function insertCategory(category: Category): void {
  const db = getDb();
  db.runSync(
    `INSERT INTO categories (id, name, color, icon, created_at, updated_at)
     VALUES (?,?,?,?,?,?)`,
    [category.id, category.name, category.color, category.icon, category.createdAt, category.updatedAt]
  );
}

export function updateCategory(category: Partial<Category> & { id: string }): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.runSync(
    `UPDATE categories SET
       name = COALESCE(?, name),
       color = COALESCE(?, color),
       icon = COALESCE(?, icon),
       updated_at = ?
     WHERE id = ?`,
    [category.name ?? null, category.color ?? null, category.icon ?? null, now, category.id]
  );
}

export function deleteCategory(id: string): void {
  const db = getDb();
  db.runSync('DELETE FROM categories WHERE id = ?', [id]);
}

// ─── Subcategory helpers ──────────────────────────────────────────────────────

function rowToSubcategory(row: Record<string, unknown>): Subcategory {
  return {
    id:         row.id as string,
    categoryId: row.category_id as string,
    name:       row.name as string,
    createdAt:  row.created_at as string,
    updatedAt:  row.updated_at as string,
  };
}

export function getSubcategories(categoryId: string): Subcategory[] {
  const db = getDb();
  const rows = db.getAllSync(
    'SELECT * FROM subcategories WHERE category_id = ? ORDER BY name ASC',
    [categoryId]
  ) as Record<string, unknown>[];
  return rows.map(rowToSubcategory);
}

export function getAllSubcategories(): Subcategory[] {
  const db = getDb();
  const rows = db.getAllSync(
    'SELECT * FROM subcategories ORDER BY name ASC'
  ) as Record<string, unknown>[];
  return rows.map(rowToSubcategory);
}

export function insertSubcategory(sub: Subcategory): void {
  const db = getDb();
  db.runSync(
    `INSERT INTO subcategories (id, category_id, name, created_at, updated_at)
     VALUES (?,?,?,?,?)`,
    [sub.id, sub.categoryId, sub.name, sub.createdAt, sub.updatedAt]
  );
}

export function deleteSubcategory(id: string): void {
  const db = getDb();
  db.runSync('DELETE FROM subcategories WHERE id = ?', [id]);
}
