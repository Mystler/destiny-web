import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { loginUser } from "$lib/server/db";
import { resolve } from "$app/paths";

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const login = data.get("login") as string;
    const password = data.get("password") as string;

    if (!login || !password) {
      return fail(400, {
        login,
        missing: true,
      });
    }

    const session = await loginUser(login.trim(), password);
    if (!session) {
      return fail(400, {
        fail: true,
        login,
      });
    }

    if (session === "BANNED") {
      return fail(403, { banned: true });
    }

    cookies.set("session", session, {
      path: "/",
    });

    return redirect(303, resolve("/(authenticated)/account"));
  },
} satisfies Actions;
