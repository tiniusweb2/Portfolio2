import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, type InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  content: text("content").notNull(),
  preview: text("preview").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: timestamp("published_at").notNull(),
  tags: text("tags").array(),
  authorId: integer("author_id").references(() => users.id),
});

// Knowledge Base Schema
export const knowledgeBaseFolders = pgTable("knowledge_base_folders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: integer("parent_id"),
  path: text("path").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  authorId: integer("author_id").references(() => users.id),
});

// Add relations after table definition
export const knowledgeBaseFoldersRelations = relations(knowledgeBaseFolders, ({ one, many }) => ({
  parent: one(knowledgeBaseFolders, {
    fields: [knowledgeBaseFolders.parentId],
    references: [knowledgeBaseFolders.id],
  }),
  children: many(knowledgeBaseFolders),
  files: many(knowledgeBaseFiles),
}));

export const knowledgeBaseFiles = pgTable("knowledge_base_files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  folderId: integer("folder_id").references(() => knowledgeBaseFolders.id),
  fileType: text("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  metadata: jsonb("metadata"),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  authorId: integer("author_id").references(() => users.id),
});

export const knowledgeBaseFilesRelations = relations(knowledgeBaseFiles, ({ one, many }) => ({
  folder: one(knowledgeBaseFolders, {
    fields: [knowledgeBaseFiles.folderId],
    references: [knowledgeBaseFolders.id],
  }),
  tags: many(knowledgeBaseFilesTags),
}));

export const knowledgeBaseTags = pgTable("knowledge_base_tags", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const knowledgeBaseFilesTags = pgTable("knowledge_base_files_tags", {
  fileId: integer("file_id").references(() => knowledgeBaseFiles.id),
  tagId: integer("tag_id").references(() => knowledgeBaseTags.id),
});

export const knowledgeBaseFilesTagsRelations = relations(knowledgeBaseFilesTags, ({ one }) => ({
  file: one(knowledgeBaseFiles, {
    fields: [knowledgeBaseFilesTags.fileId],
    references: [knowledgeBaseFiles.id],
  }),
  tag: one(knowledgeBaseTags, {
    fields: [knowledgeBaseFilesTags.tagId],
    references: [knowledgeBaseTags.id],
  }),
}));

// Schema Exports
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const selectBlogPostSchema = createSelectSchema(blogPosts);
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type SelectBlogPost = typeof blogPosts.$inferSelect;

export const insertKnowledgeBaseFolderSchema = createInsertSchema(knowledgeBaseFolders);
export const selectKnowledgeBaseFolderSchema = createSelectSchema(knowledgeBaseFolders);
export type InsertKnowledgeBaseFolder = typeof knowledgeBaseFolders.$inferInsert;
export type SelectKnowledgeBaseFolder = typeof knowledgeBaseFolders.$inferSelect;

export const insertKnowledgeBaseFileSchema = createInsertSchema(knowledgeBaseFiles);
export const selectKnowledgeBaseFileSchema = createSelectSchema(knowledgeBaseFiles);
export type InsertKnowledgeBaseFile = typeof knowledgeBaseFiles.$inferInsert;
export type SelectKnowledgeBaseFile = typeof knowledgeBaseFiles.$inferSelect;