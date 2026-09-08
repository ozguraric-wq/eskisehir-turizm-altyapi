import { sqliteTable,text,integer,primaryKey } from "drizzle-orm/sqlite-core";
// Counts only. Conversations, passwords and visitor locations are never stored here.
export const aiUsage=sqliteTable("ai_usage",{key:text("key").notNull(),bucket:integer("bucket").notNull(),count:integer("count").notNull().default(0)},table=>[primaryKey({columns:[table.key,table.bucket]})]);
