import { forgotPasswordTokenCheck, resetPassword } from "$lib/server/db";
import { error, fail, redirect, type ServerLoad } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { resolve } from "$app/paths";

export const load: ServerLoad = async ({ params }) => {
  if (params.token && (await forgotPasswordTokenCheck(params.token))) {
    return;
  }
  error(404, { message: "Invalid token!" });
};

export const actions = {
  default: async ({ request, params }) => {
    if (!params.token || !(await forgotPasswordTokenCheck(params.token))) {
      return error(404, { message: "Invalid token!" });
    }

    const data = await request.formData();
    const password = data.get("password") as string;
    const passwordConfirm = data.get("password_confirm") as string;

    const failReturn = {
      missing: false,
      passwordMismatch: false,
      passwordTooLong: false,
    };
    let validationFail = false;

    if (!password || !passwordConfirm) {
      validationFail = true;
      failReturn.missing = true;
    }
    if (password !== passwordConfirm) {
      validationFail = true;
      failReturn.passwordMismatch = true;
    }
    if (password.length > 15) {
      validationFail = true;
      failReturn.passwordTooLong = true;
    }
    if (validationFail) {
      return fail(400, failReturn);
    }

    const token = await resetPassword(params.token, password);
    if (!token) {
      return fail(400, {
        fail: true,
      });
    }

    return redirect(303, resolve("/reset/success"));
  },
} satisfies Actions;
