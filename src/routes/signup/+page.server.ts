import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createUser } from "$lib/server/db";
import { RECAPTCHA_VERIFICATION_URL } from "$env/static/private";
import { PUBLIC_RECAPTCHA_SITE_KEY } from "$env/static/public";
import * as v from "valibot";

const EmailSchema = v.pipe(v.string(), v.email());
const SignupSchema = v.pipe(
  v.object({
    login: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty("Missing username!"),
      v.check((x) => !v.is(EmailSchema, x), "Please do not use an e-mail address as your username."),
    ),
    email: v.pipe(v.string(), v.trim(), v.email("Invalid e-mail address!"), v.nonEmpty("Missing e-mail!")),
    password: v.pipe(
      v.string(),
      v.nonEmpty("Missing password!"),
      v.minLength(4, "Please use a longer password."),
      v.maxLength(15, "Sorry, URU only supports password up to 15 characters in length!"),
    ),
    passwordConfirm: v.pipe(v.string(), v.nonEmpty("Missing password confirmation!")),
    recaptchaToken: v.pipe(v.string(), v.nonEmpty("Missing captcha token! Please verify you're human!")),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["passwordConfirm"]],
      (x) => x.password === x.passwordConfirm,
      "Your password confirmation did not match!",
    ),
    ["passwordConfirm"],
  ),
);

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const dataObj = {
      login: data.get("login"),
      email: data.get("email"),
      password: data.get("password"),
      passwordConfirm: data.get("password_confirm"),
      recaptchaToken: data.get("g-recaptcha-response"),
    };
    const params = v.safeParse(SignupSchema, dataObj);

    if (!params.success) {
      return fail(400, {
        login: dataObj.login,
        email: dataObj.email,
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
        error: "You could not be verified by against bot protections... Shame...",
      });
    }

    const success = await createUser(params.output.login, params.output.email, params.output.password);
    if (!success) {
      return fail(400, {
        error: "Your account could not be created, the Username or E-Mail might already exist!",
        login: params.output.login,
        email: params.output.email,
      });
    }

    return { accountCreated: true };
  },
} satisfies Actions;
