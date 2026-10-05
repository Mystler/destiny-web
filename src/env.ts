import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  RECAPTCHA_VERIFICATION_URL: { static: true },
  PUBLIC_RECAPTCHA_SITE_KEY: { public: true, static: true },
  MAIL_TEST_MODE: { static: true },
  AGES_DIR: { static: true },
  AGEUPLOAD_DIR: { static: true },
  MAIL_ADMIN: { static: true },
  SDL_DIR: { static: true },
  DIRTSAND_LOG_FILE: { static: true },
  DIRTSAND_RESTART_COMMAND: { static: true },
  DATABASE_DB: { static: true },
  DATABASE_HOST: { static: true },
  DATABASE_PASSWORD: { static: true },
  DATABASE_USER: { static: true },
  MAIL_SENDER: { static: true },
});
