import { pgTable, uuid, varchar, timestamp, pgEnum, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users, departmentEnum } from './users';

export const folderVisibilityEnum = pgEnum('folder_visibility', ['public', 'department']);

export const folders = pgTable(
  'folders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    parentId: uuid('parent_id'),
    department: departmentEnum('department'),
    visibility: folderVisibilityEnum('visibility').default('public').notNull(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_folders_parent').on(table.parentId),
    index('idx_folders_department').on(table.department),
    unique('unique_parent_name').on(table.parentId, table.name),
  ]
);

export const foldersRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: 'parentFolder',
  }),
  children: many(folders, { relationName: 'parentFolder' }),
  createdByUser: one(users, {
    fields: [folders.createdBy],
    references: [users.id],
  }),
}));

export type FolderRecord = typeof folders.$inferSelect;
export type NewFolderRecord = typeof folders.$inferInsert;
