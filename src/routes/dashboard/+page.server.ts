import { db } from '$lib/server/db';
import { analytics, bioConfig, bioButtons } from '$lib/server/db/schema';
import { count, eq, desc, asc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { uploadToBunny, deleteFromBunny } from '$lib/server/bunny';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session) {
        throw redirect(302, '/login');
    }

    // 1. Total Views
    const totalViewsResult = await db.select({ count: count() })
        .from(analytics)
        .where(eq(analytics.type, 'view'));
    
    // 2. Total Clicks
    const totalClicksResult = await db.select({ count: count() })
        .from(analytics)
        .where(eq(analytics.type, 'click'));

    // 3. Clicks by Target
    const clicksByTarget = await db.select({
        target: analytics.target,
        count: count()
    })
    .from(analytics)
    .where(eq(analytics.type, 'click'))
    .groupBy(analytics.target)
    .orderBy(desc(count()));

    // 4. Recent Activity (Last 5)
    const recentActivity = await db.query.analytics.findMany({
        limit: 5,
        orderBy: [desc(analytics.timestamp)]
    });

    // 5. Fetch Current Config for Editing
    const config = await db.query.bioConfig.findFirst();
    const buttons = await db.query.bioButtons.findMany({
        orderBy: [asc(bioButtons.order)]
    });

    return {
        stats: {
            totalViews: totalViewsResult[0].count,
            totalClicks: totalClicksResult[0].count,
            clicksByTarget
        },
        recentActivity,
        config,
        buttons
    };
};

export const actions = {
    updateConfig: async ({ request, locals }) => {
        if (!locals.session) return { success: false, message: 'Unauthorized' };
        
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        
        const config = await db.query.bioConfig.findFirst();

        let logoUrl = config?.logoUrl || '';
        let featuredImageUrl = config?.featuredImageUrl || '';

        // Handle Logo Upload
        const logoFile = formData.get('logoUrl') as File;
        if (logoFile && logoFile.size > 0) {
            // Delete old logo
            if (config?.logoUrl) await deleteFromBunny(config.logoUrl);
            // Upload new logo
            const fileName = `logo-${Date.now()}-${logoFile.name.replace(/\s+/g, '-')}`;
            logoUrl = await uploadToBunny(logoFile, fileName);
        }

        // Handle Featured Image Upload
        const featuredFile = formData.get('featuredImageUrl') as File;
        if (featuredFile && featuredFile.size > 0) {
            // Delete old featured image
            if (config?.featuredImageUrl) await deleteFromBunny(config.featuredImageUrl);
            // Upload new featured image
            const fileName = `profile-${Date.now()}-${featuredFile.name.replace(/\s+/g, '-')}`;
            featuredImageUrl = await uploadToBunny(featuredFile, fileName);
        }
        
        const updateData = {
            siteTitle: data.siteTitle as string,
            metaDescription: data.metaDescription as string,
            logoUrl: logoUrl,
            logoLink: data.logoLink as string,
            bioTitle: data.bioTitle as string,
            bioDescription: data.bioDescription as string,
            featuredImageUrl: featuredImageUrl,
            footerText: data.footerText as string,
            loginLink: data.loginLink as string,
            registerLink: data.registerLink as string,
            headerScripts: data.headerScripts as string,
        };

        if (config) {
            await db.update(bioConfig)
                .set(updateData)
                .where(eq(bioConfig.id, config.id));
        } else {
            await db.insert(bioConfig).values(updateData);
        }
            
        return { success: true, message: 'Config updated!' };
    },

    deleteButton: async ({ request, locals }) => {
        if (!locals.session) return { success: false };
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        if (id) {
            await db.delete(bioButtons).where(eq(bioButtons.id, id));
        }
        return { success: true };
    },

    saveButton: async ({ request, locals }) => {
        if (!locals.session) return { success: false };
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        const name = formData.get('name')?.toString();
        const link = formData.get('link')?.toString();
        const icon = formData.get('icon')?.toString();
        const color = formData.get('color')?.toString();
        const order = parseInt(formData.get('order')?.toString() || '0');
        const isActive = formData.get('isActive') === 'on';

        if (!name || !link) return { success: false };

        if (id) {
            await db.update(bioButtons).set({ name, link, icon, color, order, isActive }).where(eq(bioButtons.id, id));
        } else {
            await db.insert(bioButtons).values({ name, link, icon, color, order, isActive });
        }
        return { success: true };
    }
};
