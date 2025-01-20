import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";

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

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredContact: text("preferred_contact").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default('pending'),
});

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  contactSubmissionId: integer("contact_submission_id").references(() => contactSubmissions.id),
  scheduledFor: timestamp("scheduled_for").notNull(),
  meetingType: text("meeting_type").notNull(),
  status: text("status").notNull().default('scheduled'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const socialProfiles = pgTable("social_profiles", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  username: text("username").notNull(),
  profileUrl: text("profile_url").notNull(),
  displayName: text("display_name").notNull(),
  active: boolean("active").notNull().default(true),
});

// Schema types
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const selectBlogPostSchema = createSelectSchema(blogPosts);
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type SelectBlogPost = typeof blogPosts.$inferSelect;

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
export const selectContactSubmissionSchema = createSelectSchema(contactSubmissions);
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;
export type SelectContactSubmission = typeof contactSubmissions.$inferSelect;

export const insertMeetingSchema = createInsertSchema(meetings);
export const selectMeetingSchema = createSelectSchema(meetings);
export type InsertMeeting = typeof meetings.$inferInsert;
export type SelectMeeting = typeof meetings.$inferSelect;

export const insertSocialProfileSchema = createInsertSchema(socialProfiles);
export const selectSocialProfileSchema = createSelectSchema(socialProfiles);
export type InsertSocialProfile = typeof socialProfiles.$inferInsert;
export type SelectSocialProfile = typeof socialProfiles.$inferSelect;