import { pgTable, uuid, varchar, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { folders } from './folders';

export const documents = pgTable(
  'documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    content: text('content').notNull(),
    folderId: uuid('folder_id')
      .notNull()
      .references(() => folders.id, { onDelete: 'cascade' }),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
    modifiedBy: uuid('modified_by').references(() => users.id),
    viewCount: integer('view_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_documents_folder').on(table.folderId),
    index('idx_documents_view_count').on(table.viewCount),
    index('idx_documents_updated').on(table.updatedAt),
  ]
);

export const documentsRelations = relations(documents, ({ one }) => ({
  folder: one(folders, {
    fields: [documents.folderId],
    references: [folders.id],
  }),
  createdByUser: one(users, {
    fields: [documents.createdBy],
    references: [users.id],
    relationName: 'createdBy',
  }),
  modifiedByUser: one(users, {
    fields: [documents.modifiedBy],
    references: [users.id],
    relationName: 'modifiedBy',
  }),
}));

export type DocumentRecord = typeof documents.$inferSelect;
export type NewDocumentRecord = typeof documents.$inferInsert;
