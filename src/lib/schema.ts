import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const properties = pgTable('properties', {
	id: uuid('id').defaultRandom().primaryKey(),
	slug: varchar('slug', { length: 180 }).notNull().unique(),
	title: varchar('title', { length: 180 }).notNull(),
	description: text('description').notNull(),
	city: varchar('city', { length: 100 }).notNull(),
	area: varchar('area', { length: 120 }),
	price: integer('price').notNull(),
	currency: varchar('currency', { length: 3 }).notNull(),
	bedrooms: integer('bedrooms'),
	bathrooms: integer('bathrooms'),
	sizeSqft: integer('size_sqft'),
	imageUrl: text('image_url'),
	imageAlt: varchar('image_alt', { length: 240 }),
	featured: boolean('featured').notNull().default(false),
	published: boolean('published').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const inquiries = pgTable('inquiries', {
	id: uuid('id').defaultRandom().primaryKey(),
	propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
	name: varchar('name', { length: 160 }).notNull(),
	email: varchar('email', { length: 254 }).notNull(),
	phone: varchar('phone', { length: 40 }),
	message: text('message').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Property = typeof properties.$inferSelect;
