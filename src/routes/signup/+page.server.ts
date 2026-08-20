import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createUser } from "$lib/server/db";
import { RECAPTCHA_VERIFICATION_URL } from "$env/static/private";
import { PUBLIC_RECAPTCHA_SITE_KEY } from "$env/static/public";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const login = data.get("login") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const passwordConfirm = data.get("password_confirm") as string;
    const recaptchaToken = data.get("g-recaptcha-response") as string;

    const failReturn = {
      login,
      email,
      missing: false,
      passwordMismatch: false,
      passwordTooLong: false,
    };
    let validationFail = false;

    if (!login || !email || !password || !passwordConfirm || !recaptchaToken) {
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

    // Check captcha with Google
    const gcreq = await fetch(RECAPTCHA_VERIFICATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: {
          token: recaptchaToken,
          expectedAction: "SIGNUP",
          siteKey: PUBLIC_RECAPTCHA_SITE_KEY,
        },
      }),
    });
    const gcresp: {
      tokenProperties: {
        valid: boolean;
        action: string;
      };
    } = await gcreq.json();
    if (!gcreq.ok || !gcresp || !gcresp.tokenProperties.valid || gcresp.tokenProperties.action !== "SIGNUP") {
      return fail(400, {
        captchaFailed: true,
      });
    }

    const success = await createUser(login.trim(), email.trim(), password);
    if (!success) {
      return fail(400, {
        fail: true,
        login,
        email,
      });
    }

    return { accountCreated: true };
  },
} satisfies Actions;
