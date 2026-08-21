import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { MAIL_TEST_MODE, RECAPTCHA_VERIFICATION_URL } from "$env/static/private";
import { PUBLIC_RECAPTCHA_SITE_KEY } from "$env/static/public";
import { forgotPasswordToken } from "$lib/server/db";
import { sendMail } from "$lib/server/mailer";

export const actions = {
  default: async ({ request, url }) => {
    const data = await request.formData();
    const email = data.get("email") as string;
    const recaptchaToken = data.get("g-recaptcha-response") as string;

    if (!email || !recaptchaToken) {
      return fail(400, {
        missing: true,
      });
    }
    if (!email.match(/.+@.+\..+/)) {
      return fail(400, {
        invalidEmail: true,
      });
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
          expectedAction: "RESET",
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
    if (!gcreq.ok || !gcresp || !gcresp.tokenProperties.valid || gcresp.tokenProperties.action !== "RESET") {
      return fail(400, {
        captchaFailed: true,
      });
    }

    const token = await forgotPasswordToken(email);
    let mailSent = false;

    if (token) {
      const subject = "[DestinyURU] Password Reset";
      const message = `Hello,\na password reset has been requested for your account. Please visit the following in order to set a new password:\n\n${url.origin}/reset/${token}`;
      if (MAIL_TEST_MODE === "true") {
        console.log(subject);
        console.log(message);
      } else {
        sendMail(email, subject, message);
      }
      mailSent = true;
    }

    if (!token || !mailSent) {
      return fail(400, {
        fail: true,
      });
    }

    return { success: true };
  },
} satisfies Actions;
