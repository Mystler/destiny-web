import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { MAIL_TEST_MODE, RECAPTCHA_VERIFICATION_URL } from "$env/static/private";
import { PUBLIC_RECAPTCHA_SITE_KEY } from "$env/static/public";
import { forgotPasswordToken } from "$lib/server/db";
import { sendMail } from "$lib/server/mailer";
import * as v from "valibot";

const ResetSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email("Invalid e-mail address!"), v.nonEmpty("Missing e-mail!")),
  recaptchaToken: v.pipe(v.string(), v.nonEmpty("Missing captcha token! Please verify you're human!")),
});

export const actions = {
  default: async ({ request, url }) => {
    const data = await request.formData();
    const dataObj = {
      email: data.get("email"),
      recaptchaToken: data.get("g-recaptcha-response"),
    };
    const params = v.safeParse(ResetSchema, dataObj);
    if (!params.success) {
      return fail(400, {
        issues: params.issues.map((x) => {
          return { path: x.path, message: x.message };
        }),
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
          token: params.output.recaptchaToken,
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
        error: "You could not be verified by against bot protections... Shame...",
      });
    }

    const token = await forgotPasswordToken(params.output.email);
    let mailSent = false;

    if (token) {
      const subject = "[DestinyURU] Password Reset";
      const message = `Hello,\na password reset has been requested for your account. Please visit the following in order to set a new password:\n\n${url.origin}/reset/${token}`;
      if (MAIL_TEST_MODE === "true") {
        console.log(subject);
        console.log(message);
      } else {
        sendMail(params.output.email, subject, message);
      }
      mailSent = true;
    }

    if (!token || !mailSent) {
      return fail(400, {
        error: "Could not begin reset procedures. The specified e-mail address may not exist.",
      });
    }

    return { success: true };
  },
} satisfies Actions;
