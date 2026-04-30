import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const analytics = pgTable("analytics", {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull(), // 'view' or 'click'
    target: text("target").notNull(), // 'page', button name, or button id
    metadata: jsonb("metadata"), // { ip, userAgent, path, etc }
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});
