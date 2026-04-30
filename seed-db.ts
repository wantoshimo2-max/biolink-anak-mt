import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/server/db/schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in .env');
}

const client = postgres(databaseUrl);
const db = drizzle(client, { schema });

async function seed() {
    console.log('Seeding database...');

    // 1. Insert Bio Config
    await db.insert(schema.bioConfig).values({
        siteTitle: 'Arwanagaming Situs Resmi Terpercaya 2026',
        metaDescription: 'Arwanagaming adalah sebuah platform hiburan daring yang berfokus pada layanan perjudian online, mencakup berbagai jenis permainan seperti slot, taruhan olahraga, dan kasino siaran langsung (live casino).',
        logoUrl: '/images/logo-arwanagaming.png',
        logoLink: 'https://arwanagaming.live/',
        bioTitle: 'ArwanaGaming',
        bioDescription: 'Official Digital Gateway of Arwanagaming.',
        featuredImageUrl: '/images/profile-arwanagaming.webp',
        footerText: '&copy; 2026 ARWANAGAMING | BOS SANDI',
        loginLink: 'https://arwanagaming.live/',
        registerLink: 'https://arwanagaming.live/',
    }).onConflictDoNothing();

    console.log('Bio config seeded');

    // 2. Insert Bio Buttons
    const buttons = [
        { name: 'RESULT', icon: 'Trophy', link: 'https://arwanagaming.live/', color: 'hover:text-yellow-500', order: 1 },
        { name: 'PREDIKSI', icon: 'Zap', link: 'https://arwanagaming.live/', color: 'hover:text-blue-400', order: 2 },
        { name: 'RTP SLOT', icon: 'Gauge', link: 'https://arwanagaming.live/', color: 'hover:text-green-500', order: 3 },
        { name: 'LIVE DRAW', icon: 'Tv', link: 'https://arwanagaming.live/', color: 'hover:text-red-500', order: 4 }
    ];

    for (const btn of buttons) {
        await db.insert(schema.bioButtons).values(btn).onConflictDoNothing();
    }

    console.log('Bio buttons seeded');
    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
