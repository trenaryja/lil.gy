import { pgTable, text, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core'

// Links table - userId references WorkOS user ID
export const links = pgTable('links', {
	id: uuid('id').primaryKey().defaultRandom(),
	slug: text('slug').unique().notNull(),
	url: text('url').notNull(),
	userId: text('user_id'), // WorkOS user ID (nullable for anonymous links)
	clicks: integer('clicks').default(0).notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Click events for analytics
export const clickEvents = pgTable('click_events', {
	id: uuid('id').primaryKey().defaultRandom(),
	linkId: uuid('link_id')
		.notNull()
		.references(() => links.id, { onDelete: 'cascade' }),
	timestamp: timestamp('timestamp').defaultNow().notNull(),
	referrer: text('referrer'),
	userAgent: text('user_agent'),
	country: text('country'),
	city: text('city'),
})
