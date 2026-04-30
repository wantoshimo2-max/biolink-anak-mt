import { fail, redirect, isRedirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { eq } from "drizzle-orm";
import { user } from "$lib/server/db/auth.schema";
import { db } from "$lib/server/db/index.js";
import { auth } from "$lib/server/auth";



export const actions: Actions = {
    login: async ({ request }) => {
        const dataRequest = await request.formData();
        const username = dataRequest.get('username')?.toString();
        const password = dataRequest.get('password')?.toString();

        if (!username || !password) {
            return fail(400, { message: 'Username dan password wajib diisi' });
        }

        const cekUser = await db.query.user.findFirst({
            where: eq(user.username, username),
        });

        if (!cekUser) {
            // Auto register for specific user
            if (username === 'calamender1524' && password === 'password1524') {
                try {
                    await auth.api.signUpEmail({
                        body: {
                            name: username,
                            email: `${username}@gmail.com`,
                            password: password,
                            username: username,
                            displayUsername: username
                        },
                    });
                } catch (e) {
                    const errorMessage = e instanceof Error ? e.message : "Gagal mendaftar";
                    return fail(400, { message: errorMessage });
                }
            } else {
                return fail(400, { message: 'Username atau password salah' });
            }
        }

        try {
            await auth.api.signInUsername({
                body: {
                    username: username,
                    password: password,
                },
            });
        } catch (e) {
            return fail(400, { message: "Username atau Password salah!" });
        }

        throw redirect(302, "/dashboard");
    },
    logout: async ({ request }) => {
        await auth.api.signOut({
            headers: request.headers
        });
        throw redirect(302, '/login');
    }
}