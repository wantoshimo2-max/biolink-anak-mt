import { db } from '$lib/server/db';
import { bioConfig, bioButtons, analytics } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, getClientAddress }) => {
    // 1. Fetch Config
    const config = await db.query.bioConfig.findFirst();

    // 2. Fetch Buttons
    const buttons = await db.query.bioButtons.findMany({
        where: eq(bioButtons.isActive, true),
        orderBy: [asc(bioButtons.order)]
    });

    // 3. Track Page View
    // Note: getClientAddress() might need specific adapter config in production
    let ip = 'unknown';
    try {
        ip = getClientAddress();
    } catch (e) {
        // Fallback for some environments
    }
    
    const userAgent = request.headers.get('user-agent');
    
    // Fire and forget analytics
    db.insert(analytics).values({
        type: 'view',
        target: 'page',
        metadata: { ip, userAgent }
    }).catch((err) => console.error('Analytics Error:', err));

    return {
        config,
        buttons
    };
};

export const actions = {
    trackClick: async ({ request, getClientAddress }) => {
        const formData = await request.formData();
        const target = formData.get('target')?.toString();
        
        if (!target) return { success: false };

        let ip = 'unknown';
        try { ip = getClientAddress(); } catch (e) {}
        const userAgent = request.headers.get('user-agent');

        await db.insert(analytics).values({
            type: 'click',
            target: target,
            metadata: { ip, userAgent }
        }).catch((err) => console.error('Click Analytics Error:', err));

        return { success: true };
    }
};
