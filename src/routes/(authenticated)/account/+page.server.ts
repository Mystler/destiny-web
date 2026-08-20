import { changeEmail, changePassword, getUserAvatars } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { resolve } from "$app/paths";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return;
  return {
    email: event.locals.user.email,
    avatars: await getUserAvatars(event.locals.user.authId),
  };
};

export const actions = {
  change_email: async ({ request, locals }) => {
    if (!locals.user) return redirect(303, resolve("/login"));

    const data = await request.formData();
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    if (!email || !password) {
      return fail(400, {
        error: "Missing data.",
      });
    }

    if (await changeEmail(locals.user.webId, password, email)) return { success: "E-Mail address changed!" };
    return fail(400, { error: "Changing E-Mail address failed. Your password may have been wrong!" });
  },
  change_password: async ({ request, locals, cookies }) => {
    if (!locals.user) return redirect(303, resolve("/login"));

    const data = await request.formData();
    const oldPw = data.get("old_password") as string;
    const newPw = data.get("new_password") as string;
    const pwConfirm = data.get("password_confirm") as string;

    if (!oldPw || !newPw || !pwConfirm) {
      return fail(400, {
        error: "Missing data.",
      });
    }
    if (newPw !== pwConfirm) {
      return fail(400, {
        error: "Password mismatch!",
      });
    }
    if (newPw.length > 16) {
      return fail(400, {
        error: "Sorry, URU only supports password up to 15 characters in length!",
      });
    }

    const token = await changePassword(locals.user.webId, oldPw, newPw);
    if (!token) {
      return fail(400, {
        error: "Changing password failed. Your old password may have been wrong!",
      });
    }
    cookies.set("session", token, { path: "/" });

    return { success: "Password changed!" };
  },
} satisfies Actions;
