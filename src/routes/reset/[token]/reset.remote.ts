import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { forgotPasswordTokenCheck, resetPassword } from "$lib/server/db";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const setNewPassword = form(
  v.object({
    _new_password: v.pipe(
      v.string(),
      v.nonEmpty("Missing password!"),
      v.maxLength(15, "Sorry, URU only supports password up to 15 characters in length!"),
    ),
    _password_confirm: v.pipe(v.string(), v.nonEmpty("Missing password confirmation!")),
  }),
  async ({ _new_password, _password_confirm }) => {
    const { params } = getRequestEvent();
    if (!params.token || !(await forgotPasswordTokenCheck(params.token))) {
      return error(404, { message: "Invalid token!" });
    }

    if (_new_password !== _password_confirm)
      return {
        error: "Your password confirmation did not match!",
      };

    const token = await resetPassword(params.token, _new_password);
    if (!token) {
      return {
        error: "Failed to reset password!",
      };
    }

    return redirect(303, resolve("/reset/success"));
  },
);
