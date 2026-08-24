import { form, getRequestEvent, query } from "$app/server";
import { getUserAvatars, changeEmail, changePassword } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import * as v from "valibot";

export const getAvatars = query.live(async function* () {
  const event = getRequestEvent();
  if (!event.locals.user) return error(401, "Unauthorized");
  while (true) {
    yield await getUserAvatars(event.locals.user.authId);
    await new Promise((f) => setTimeout(f, 5000));
  }
});

export const updateEmail = form(
  v.object({
    email: v.pipe(v.string(), v.email("Invalid e-mail address!"), v.nonEmpty("Missing e-mail!")),
    password: v.pipe(v.string(), v.nonEmpty("Missing password!")),
  }),
  async ({ email, password }) => {
    const event = getRequestEvent();
    if (!event.locals.user) return error(401, "Unauthorized");

    if (await changeEmail(event.locals.user.webId, password, email)) return { success: "E-Mail address changed!" };
    return { error: "Changing E-Mail address failed. Your password may have been wrong!" };
  },
);

export const updatePassword = form(
  v.object({
    _old_password: v.pipe(v.string(), v.nonEmpty("Missing current password!")),
    _new_password: v.pipe(
      v.string(),
      v.nonEmpty("Missing new password!"),
      v.minLength(4, "Please use a longer password."),
      v.maxLength(15, "Sorry, URU only supports password up to 15 characters in length!"),
    ),
    _password_confirm: v.pipe(v.string(), v.nonEmpty("Missing password confirmation!")),
  }),
  async ({ _old_password, _new_password, _password_confirm }) => {
    const event = getRequestEvent();
    if (!event.locals.user) return error(401, "Unauthorized");

    if (_new_password !== _password_confirm) return { error: "Password mismatch!" };

    const token = await changePassword(event.locals.user.webId, _old_password, _new_password);
    if (!token) {
      return {
        error: "Changing password failed. Your old password may have been wrong!",
      };
    }
    event.cookies.set("session", token, { path: "/" });
    return { success: "Password changed!" };
  },
);
