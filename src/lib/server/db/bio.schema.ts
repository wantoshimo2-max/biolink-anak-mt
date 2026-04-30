import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";

export const bioConfig = pgTable("bio_config", {
    id: uuid("id").primaryKey().defaultRandom(),
    siteTitle: text("site_title").notNull().default("Premium Bio Link"),
    metaDescription: text("meta_description").notNull().default("A modern glassmorphism bio link page"),
    logoUrl: text("logo_url").notNull().default("/images/logo-arwanagaming.png"),
    logoLink: text("logo_link").notNull().default("https://arwanagaming.live/"),
    bioTitle: text("bio_title").notNull().default("ArwanaGaming"),
    bioDescription: text("bio_description").notNull().default("Official Digital Gateway of Arwanagaming."),
    featuredImageUrl: text("featured_image_url").notNull().default("/images/profile-arwanagaming.webp"),
    footerText: text("footer_text").notNull().default("&copy; 2026 ARWANAGAMING | BOS SANDI"),
    loginLink: text("login_link").notNull().default("https://arwanagaming.live/"),
    registerLink: text("register_link").notNull().default("https://arwanagaming.live/"),
    headerScripts: text("header_scripts"),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const bioButtons = pgTable("bio_buttons", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    link: text("link").notNull(),
    icon: text("icon").notNull().default("ExternalLink"), // Lucide icon name
    color: text("color").notNull().default("hover:text-white"), // Tailwind hover class
    order: integer("order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
