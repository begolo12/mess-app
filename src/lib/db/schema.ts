import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', [
  'ketua',
  'advisor',
  'program',
  'bendahara',
  'kebersihan',
  'humas',
  'konsumsi',
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  firstName: text('first_name').notNull(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull(),
  advisor: text('advisor'),
  mustChangePassword: integer('must_change_password').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const financeEntries = pgTable('finance_entries', {
  id: serial('id').primaryKey(),
  type: pgEnum('finance_type', ['income', 'expense'])('type').notNull(),
  amount: integer('amount').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  date: date('date').notNull(),
  recordedBy: integer('recorded_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const programs = pgTable('programs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  scheduledFor: timestamp('scheduled_for').notNull(),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const picketAreas = pgTable('picket_areas', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const picketSchedules = pgTable('picket_schedules', {
  id: serial('id').primaryKey(),
  areaId: integer('area_id')
    .notNull()
    .references(() => picketAreas.id),
  assignedTo: integer('assigned_to')
    .notNull()
    .references(() => users.id),
  scheduledFor: date('scheduled_for').notNull(),
  status: pgEnum('picket_status', ['pending', 'completed', 'skipped'])(
    'status'
  )
    .notNull()
    .default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const picketReports = pgTable('picket_reports', {
  id: serial('id').primaryKey(),
  scheduleId: integer('schedule_id')
    .notNull()
    .references(() => picketSchedules.id),
  completedBy: integer('completed_by')
    .notNull()
    .references(() => users.id),
  notes: text('notes'),
  completedAt: timestamp('completed_at').notNull().defaultNow(),
});

export const picketPhotos = pgTable('picket_photos', {
  id: serial('id').primaryKey(),
  reportId: integer('report_id')
    .notNull()
    .references(() => picketReports.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});

export const kitchenStock = pgTable('kitchen_stock', {
  id: serial('id').primaryKey(),
  item: text('item').notNull().unique(),
  qty: integer('qty').notNull().default(0),
  unit: text('unit').notNull(),
  threshold: integer('threshold').notNull().default(2),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
});
