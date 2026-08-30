import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { loginUser } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import * as v from "valibot";

const EmailSchema = v.pipe(v.string(), v.email());

export const login = form(
  v.object({
    username: v.pipe(
      v.string(),
      v.nonEmpty("Missing username!"),
      v.check((x) => !v.is(EmailSchema, x), "You used an e-mail instead of a username."),
    ),
    _password: v.pipe(v.string(), v.nonEmpty("Missing password!")),
    remember: v.optional(v.boolean(), false),
  }),
  async ({ username, _password, remember }) => {
    const session = await loginUser(username.trim(), _password);
    if (!session) {
      return {
        error: "Login failed!",
        username,
      };
    }

    if (session === "BANNED") {
      return { error: "This account has been banned!" };
    }

    const expireDate = new Date();
    expireDate.setFullYear(expireDate.getFullYear() + 1);
    const { cookies } = getRequestEvent();
    cookies.set("session", session, {
      path: "/",
      expires: remember ? expireDate : undefined,
    });

    return redirect(303, resolve("/(authenticated)/account"));
  },
);
