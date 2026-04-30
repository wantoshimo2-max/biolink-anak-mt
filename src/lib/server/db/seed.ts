import { db } from './index';
import { bioConfig, bioButtons } from './schema';
import { Trophy, Zap, Gauge, Tv } from 'lucide-svelte';

async function seed() {
    console.log('Seeding database...');

    // 1. Clear existing data (optional, but good for idempotent seeding)
    // await db.delete(bioButtons);
    // await db.delete(bioConfig);

    // 2. Insert Bio Config
    const [config] = await db.insert(bioConfig).values({
        siteTitle: 'Premium Bio Link',
        metaDescription: 'A modern glassmorphism bio link page',
        logoUrl: '/images/logo-arwanagaming.png',
        logoLink: 'https://arwanagaming.live/',
        bioTitle: 'ArwanaGaming',
        bioDescription: 'Official Digital Gateway of Arwanagaming.',
        featuredImageUrl: '/images/profile-arwanagaming.webp',
        footerText: '&copy; 2026 ARWANAGAMING | BOS SANDI',
        loginLink: 'https://arwanagaming.live/',
        registerLink: 'https://arwanagaming.live/',
    }).onConflictDoNothing().returning();

    console.log('Bio config seeded');

    // 3. Insert Bio Buttons
    const buttons = [
        { name: 'RESULT', icon: 'Trophy', link: 'https://arwanagaming.live/', color: 'hover:text-yellow-500', order: 1 },
        { name: 'PREDIKSI', icon: 'Zap', link: 'https://arwanagaming.live/', color: 'hover:text-blue-400', order: 2 },
        { name: 'RTP SLOT', icon: 'Gauge', link: 'https://arwanagaming.live/', color: 'hover:text-green-500', order: 3 },
        { name: 'LIVE DRAW', icon: 'Tv', link: 'https://arwanagaming.live/', color: 'hover:text-red-500', order: 4 }
    ];

    for (const btn of buttons) {
        await db.insert(bioButtons).values(btn).onConflictDoNothing();
    }

    console.log('Bio buttons seeded');
    console.log('Seeding complete!');
}

seed().catch(console.error);
